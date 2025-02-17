import { ErrorMessage } from '@hookform/error-message';
import { useFormContext } from 'react-hook-form';

interface InputProps {
  type: string;
  name: string;
  label?: string;
  className: string;
  placeholder?: string;
}
export default function Input({
  type,
  name,
  label,
  className,
  placeholder,
}: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { ref, ...restOfRegister } = register(name);
  return (
    <>
      {label && (
        <label
          className={`block text-sm font-medium text-gray-700 ${errors[name] ? 'border-red' : 'border-gray-200'}`}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={className}
        {...restOfRegister}
        ref={ref}
      />
      <ErrorMessage
        name={name}
        errors={errors}
        render={({ message }) => (
          <p className="text-red-500 font-bahij text-xs mt-2">{message}</p>
        )}
      />
    </>
  );
}
