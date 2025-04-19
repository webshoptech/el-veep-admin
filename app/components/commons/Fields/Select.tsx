interface SelectProps {
    label: string;
    id: string;
    options: string[];
  }
  
  const Select: React.FC<SelectProps> = ({ label, id, options }) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1">
          <select
            id={id}
            name={id}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            {options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  export default Select;