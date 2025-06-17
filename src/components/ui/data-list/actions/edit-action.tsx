import Link from "next/link";
import { Button } from "../../button";
import { Pencil } from "lucide-react";

interface EditActionProps {
  href: string;
}

export function EditAction ({ href }: EditActionProps) {
  return (
    <Button size="icon" variant="ghost">
      <Link href={href}>
        <Pencil />
      </Link>
    </Button>
  );
}