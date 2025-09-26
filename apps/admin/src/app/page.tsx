import { Button } from '@arvasit/components';
import { formatCurrency } from '@arvasit/utils';

export default function AdminDashboard() {
  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Arvasit Admin Dashboard</h1>
        <div className="mt-8 space-x-4">
          <Button variant="primary">Manage Users</Button>
          <Button variant="outline">Manage Products</Button>
        </div>
        <p className="mt-4 text-lg">Admin tools: {formatCurrency(0)}</p>
      </div>
    </main>
  );
}
