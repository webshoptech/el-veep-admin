import Image from 'next/image';
import Link from 'next/link';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function AuthHeader({ title, subtitle, children }: AuthHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-green-950">
      
      {/* Left Side: Optimized Image Container */}
      <div className="relative h-64 md:h-auto md:w-1/2 overflow-hidden">
       
        {/* Optional Overlay to match your brand green */}
        <div className="absolute inset-0 bg-green-900/20 mix-blend-multiply" />
      </div>

      {/* Right Side: Form Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white rounded-t-4xl md:rounded-t-none md:rounded-l-[3rem] z-10 -mt-10 md:mt-0">
        <Link href="/">
           
        </Link>

        <div className="w-full max-w-md text-center">
            <h1 className="text-3xl font-extrabold mb-2 text-gray-900 tracking-tight">
                {title}
            </h1>
            {subtitle && <p className="text-gray-500 mb-8 font-medium">{subtitle}</p>}
            
            <div className="w-full text-left">
                {children}
            </div>
        </div>
      </div>
    </div>
  );
}