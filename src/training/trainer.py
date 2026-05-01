"""Model trainer with MLflow logging."""
from __future__ import annotations
from pathlib import Path
import mlflow
import torch
from sklearn.metrics import f1_score, roc_auc_score
class Trainer:
    """Training utility with scheduler, clipping, and early stopping."""
    def __init__(self, model: torch.nn.Module) -> None:
        self.model=model; self.optimizer=torch.optim.AdamW(model.parameters(),lr=1e-3,weight_decay=1e-4); self.scheduler=torch.optim.lr_scheduler.CosineAnnealingLR(self.optimizer,T_max=50); self.best=-1.0; self.wait=0; self.patience=10
    def train_epoch(self, loader, loss_fn) -> float:
        """Train single epoch and return mean loss."""
        self.model.train(); total=0.0
        for ecg,y,_,g in loader:
            out=self.model(ecg,g,None); loss=loss_fn(out["logits"],y,out["context"],out["x_recon"],out["mu"],out["logvar"],out["mem_read"]); self.optimizer.zero_grad(); loss.backward(); torch.nn.utils.clip_grad_norm_(self.model.parameters(),1.0); self.optimizer.step(); total+=float(loss.item())
        self.scheduler.step(); return total/max(len(loader),1)
    def validate(self, loader) -> tuple[float,float]:
        """Compute validation macro-F1 and multiclass AUC."""
        self.model.eval(); ys=[]; probs=[]
        with torch.no_grad():
            for ecg,y,_,g in loader:
                p=torch.softmax(self.model(ecg,g,None)["logits"],dim=1); ys.extend(y.numpy().tolist()); probs.extend(p.numpy().tolist())
        yt=torch.tensor(ys).numpy(); yp=torch.tensor(probs).numpy(); pred=yp.argmax(axis=1); return float(f1_score(yt,pred,average="macro")), float(roc_auc_score(yt,yp,multi_class="ovr"))
    def fit(self, train_loader, val_loader, loss_fn, epochs: int = 50, checkpoint_path: Path = Path("checkpoints/best_model.pt")) -> None:
        """Run training loop with MLflow and early stopping."""
        checkpoint_path.parent.mkdir(parents=True, exist_ok=True)
        with mlflow.start_run():
            for e in range(epochs):
                tr=self.train_epoch(train_loader, loss_fn); f1,auc=self.validate(val_loader); mlflow.log_metrics({"train_loss":tr,"val_f1":f1,"val_auc":auc},step=e)
                if f1>self.best: self.best=f1; self.wait=0; torch.save(self.model.state_dict(), checkpoint_path)
                else: self.wait += 1
                if self.wait >= self.patience: break
