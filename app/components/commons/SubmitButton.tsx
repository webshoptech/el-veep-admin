import React from 'react';
import ReactLoading from 'react-loading';

type SubmitButtonProps = {
  label?: string;
  loading?: boolean;
};

export function SubmitButton({ label = 'Save changes', loading = false }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full inline-flex items-center cursor-pointer justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-bold rounded-md text-white ${
        loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-400 hover:bg-orange-600'
      }`}
    >
      {loading ? (
        <>
          <ReactLoading type="spin" color="#fff" height={16} width={16} className="mr-2" />
          Processing...
        </>
      ) : (
        label
      )}
    </button>
  );
}
