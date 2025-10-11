import Image from 'next/image';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function AuthHeader({ title, subtitle, children }: AuthHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-green-950">
      {/* Left Side: Image */}
      <div
        className="h-40 md:h-full md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/login.jpg')" }}
      ></div>

      {/* Right Side: Header (logo + title + children) */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-8 bg-white">
        <Image
          width={200}
          height={200}
          src="/logo.svg"
          alt="Logo"
          className="mb-10"
        />

        <h1 className="text-2xl font-bold mb-2 text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}

        {children}
      </div>
    </div>
  );
}
