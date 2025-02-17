import { twMerge } from 'tailwind-merge';

export default function Button({
  label,
  type,
  className,
  isLoading = false,
}: {
  label: string;
  type: 'submit' | 'reset' | 'button' | undefined;
  className: string;
  isLoading?: boolean | undefined;
}) {
  return (
    <button
      type={type}
      className={twMerge(className, isLoading ? 'cursor-not-allowed' : '')}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="relative">
          <div
            dir="ltr"
            className={`flex justify-center pointer-events-none items-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
              !isLoading ? 'invisible' : ''
            }`}
          >
            <span className="inline-block w-2 h-2 bg-[currentColor] rounded-full animate-bounce"></span>
            <span className="inline-block w-2 h-2 bg-[currentColor] rounded-full animate-bounce animation-delay-75"></span>
            <span className="inline-block w-2 h-2 bg-[currentColor] rounded-full animate-bounce animation-delay-150"></span>
          </div>
          <div className={isLoading ? 'invisible' : ''}>{label}</div>
        </div>
      ) : (
        label
      )}
    </button>
  );
}
