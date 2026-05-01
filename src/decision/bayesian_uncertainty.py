"""Bayesian uncertainty utilities."""
from __future__ import annotations
import torch
from torch import nn
class BayesianEstimator:
    """Monte Carlo dropout uncertainty estimator."""
    def enable_dropout(self, model: nn.Module) -> None:
        """Enable dropout layers in inference mode."""
        for m in model.modules():
            if isinstance(m, nn.Dropout): m.train()
    def mc_predict(self, model, x: torch.Tensor, n_samples: int = 50):
        """Estimate predictive mean and uncertainty via MC dropout."""
        if hasattr(model, "modules"):
            self.enable_dropout(model)
        preds=[]; vars_=[]
        for _ in range(n_samples):
            out=model(x)
            if isinstance(out, tuple): pred,var=out
            else: pred,var=out,torch.zeros_like(out)
            preds.append(pred.unsqueeze(0)); vars_.append(var.unsqueeze(0))
        p=torch.cat(preds,dim=0); v=torch.cat(vars_,dim=0)
        return p.mean(dim=0), p.std(dim=0), v.mean(dim=0)
    def uncertainty_score(self, epistemic_std: torch.Tensor, aleatoric_std: torch.Tensor) -> torch.Tensor:
        """Return normalized uncertainty score in [0,1]."""
        return torch.sigmoid(torch.sqrt(epistemic_std**2 + aleatoric_std**2))
