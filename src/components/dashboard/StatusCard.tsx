const StatusCard = () => (
  <div className="glass-card rounded-xl p-5 flex items-center justify-between">
    <div>
      <h3 className="font-heading font-semibold text-foreground text-sm">Status</h3>
      <p className="text-xs text-muted-foreground mt-0.5">No active plan</p>
    </div>
    <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
      Inactive
    </span>
  </div>
);

export default StatusCard;
