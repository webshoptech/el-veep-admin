
interface TextareaProps {
    label: string;
    id: string;
    rows?: number;
    placeholder?: string;
  }
  
  const Textarea: React.FC<TextareaProps> = ({ label, id, rows = 3, placeholder }) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1">
          <textarea
            id={id}
            name={id}
            rows={rows}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  };

  export default Textarea;