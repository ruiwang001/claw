from sqlalchemy.orm import Session
from .models import Holding, TriggerRule

def get_or_create_rule(db: Session, holding: Holding) -> TriggerRule:
    rule = db.query(TriggerRule).filter(TriggerRule.holding_id == holding.id).first()
    if rule:
        return rule
    rule = TriggerRule(holding_id=holding.id)
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule

def should_trigger(rule: TriggerRule, risk: float, sentiment: float, hot: float, change_pct_1d: float) -> tuple[bool, str]:
    if not rule.enabled:
        return False, ""
    if risk >= rule.risk_ge:
        return True, f"risk>= {rule.risk_ge}"
    if sentiment <= rule.sentiment_le:
        return True, f"sentiment<= {rule.sentiment_le}"
    if hot >= rule.hot_ge:
        return True, f"hot>= {rule.hot_ge}"
    if abs(change_pct_1d) >= rule.change_abs_ge:
        return True, f"|change|>= {rule.change_abs_ge}%"
    return False, ""
