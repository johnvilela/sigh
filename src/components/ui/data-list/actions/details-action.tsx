import Link from "next/link";
import { Button } from "../../button";
import { Eye } from "lucide-react";

interface DetailsActionProps {
  href: string;
}

export function DetailsAction ({ href }: DetailsActionProps) {
  return (
    <Button size="icon" variant="ghost">
      <Link href={href}>
        <Eye />
      </Link>
    </Button>
  );
}