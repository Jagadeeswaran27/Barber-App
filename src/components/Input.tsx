interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div>
      <label 
        htmlFor={props.name} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        {...props}
        id={props.name}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-shadow ${
          error
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-300 focus:ring-amber-500'
        } ${className}`}
      />
    </div>
  );
}