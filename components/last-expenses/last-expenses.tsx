import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { getLatestGroupedExpenses } from "@/lib/actions/getLatestGroupedExpenses";

function getInitials(displayName?: string) {
  if (!displayName) return "?";

  return displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function LastExpenses() {
  const groupedExpenses = await getLatestGroupedExpenses({ limit: 3 });

  if (!groupedExpenses) return null;

  return groupedExpenses.flatMap(({ user, expenses }) =>
    expenses.map((expense) => (
      <Item key={expense.id} className="max-w-lg">
        <ItemMedia>
          <Avatar>
            {user?.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.display_name} />
            ) : null}
            <AvatarFallback>{getInitials(user?.display_name)}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent className="flex-row justify-evenly">
          <ItemTitle>{expense.category}</ItemTitle>
          <ItemDescription>{String(expense.expense_date)}</ItemDescription>
        </ItemContent>
        <ItemActions>{`${expense.currency} ${expense.amount}`}</ItemActions>
      </Item>
    )),
  );
}
