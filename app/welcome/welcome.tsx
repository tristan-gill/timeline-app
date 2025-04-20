import { Form, useNavigation } from "react-router";

export function Welcome({
  message,
}: {
  message: string;
}) {
  const navigation = useNavigation();

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="max-w-[600px] w-full space-y-6 px-4">
          <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            
          </div>
        </div>
      </div>
    </main>
  );
}
