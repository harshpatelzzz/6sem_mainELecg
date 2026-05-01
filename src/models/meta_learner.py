"""MAML meta-learning adapter."""
from __future__ import annotations
import copy
import torch
import torch.nn.functional as F
class MAMLAdapter:
    """MAML helper for patient-specific adaptation."""
    def adapt(self, model, support_x: torch.Tensor, support_y: torch.Tensor, n_steps: int = 5, inner_lr: float = 0.01):
        """Run inner-loop adaptation and return adapted model."""
        adapted=copy.deepcopy(model); opt=torch.optim.SGD(adapted.parameters(), lr=inner_lr)
        for _ in range(n_steps):
            out=adapted(support_x)["logits"] if isinstance(adapted(support_x), dict) else adapted(support_x)
            loss=F.cross_entropy(out, support_y); opt.zero_grad(); loss.backward(); opt.step()
        return adapted
    def meta_train_step(self, model, task_batch, outer_optimizer) -> float:
        """Run one outer-loop MAML update step."""
        outer_optimizer.zero_grad(); total=0.0
        for sx,sy,qx,qy in task_batch:
            adapted=self.adapt(model,sx,sy); qout=adapted(qx)["logits"] if isinstance(adapted(qx), dict) else adapted(qx); loss=F.cross_entropy(qout,qy); loss.backward(); total+=float(loss.item())
        outer_optimizer.step(); return total/max(len(task_batch),1)
