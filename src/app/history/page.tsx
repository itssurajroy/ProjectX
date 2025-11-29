
export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My History</h1>
      </div>

        <div className="text-center py-16">
          <h3 className="text-xl font-semibold">Login to see your history</h3>
          <p className="text-muted-foreground">Your viewing history will appear here once you are logged in.</p>
        </div>
    </div>
  );
}
