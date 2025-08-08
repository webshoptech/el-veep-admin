
'use client';

interface Props {
    onClose: () => void;
}
export default function InviteForm({ onClose }: Props) {

    return (
        <div>
            <h1 className="text-2xl font-bold text-black">Invite Form</h1>
        </div>
    );
}