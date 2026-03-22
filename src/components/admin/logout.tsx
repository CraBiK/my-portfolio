import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react"; // Иконка для красоты

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <Button variant="ghost" size="sm" type="submit" className="gap-2">
        <LogOut className="h-4 w-4 bg-background md:rounded-md hover:rounded-md hover:bg-primary hover:text-foreground transition-all" />
         
      </Button>
    </form>
  );
}
