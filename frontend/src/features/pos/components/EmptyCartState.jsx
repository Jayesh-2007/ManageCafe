function EmptyCartState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center py-12 animate-modal-in">
      <div className="flex h-[96px] w-[96px] items-center justify-center rounded-2xl border border-border/80 bg-surface shadow-sm">
        <div className="h-12 w-[64px] rounded-lg border-2 border-accent bg-background relative flex flex-col justify-center gap-1.5 p-2">
          <div className="h-1.5 rounded bg-border w-full" />
          <div className="h-1.5 rounded bg-border w-2/3" />
        </div>
      </div>
      <p className="text-body font-bold text-copy-secondary">Add products to get started</p>
    </div>
  );
}

export default EmptyCartState;
