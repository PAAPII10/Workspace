import { Button } from '@arvasit/components';
import { formatCurrency } from '@arvasit/utils';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Arvasit Web App</h1>
        <div className="mt-8 space-x-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </div>
        <p className="mt-4 text-lg">Example: {formatCurrency(99.99)}</p>
      </div>
    </main>
  );
}
