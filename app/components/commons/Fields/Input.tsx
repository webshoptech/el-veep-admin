interface InputProps {
    label: string;
    id: string;
    type?: string;
    placeholder?: string;
    helpText?: string;
    showHelpText?: boolean;
  }
  
  const Input: React.FC<InputProps> = ({ label, id, type = 'text', placeholder, helpText, showHelpText }) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1">
          <input
            type={type}
            name={id}
            id={id}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder={placeholder}
          />
        </div>
        {showHelpText && helpText && (
          <p className="mt-2 text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  };

  export default Input;