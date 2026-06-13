function EmptyCartState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-[96px] w-[96px] items-center justify-center rounded border border-border bg-surface">
        <div className="h-12 w-[64px] rounded border-2 border-accent bg-background">
          <div className="mx-4 mt-4 h-2 rounded bg-border" />
          <div className="mx-4 mt-2 h-2 rounded bg-border" />
        </div>
      </div>
      <p className="text-body text-copy-secondary">Add products to get started</p>
    </div>
  );
}

export default EmptyCartState;
