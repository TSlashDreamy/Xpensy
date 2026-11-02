import { format, parseISO } from "date-fns";

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
import { getCurrencies } from "@/lib/currencies";

const amountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function getInitials(displayName?: string) {
  const name = displayName?.trim();
  if (!name) return "?";

  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function LastExpenses() {
  const [groupedExpenses, currencies] = await Promise.all([
    getLatestGroupedExpenses({ limit: 3 }),
    getCurrencies(),
  ]);

  if (!groupedExpenses) return null;

  const symbols = new Map(
    currencies.map(({ code, symbol }) => [code, symbol ?? code]),
  );

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
          <ItemDescription>
            {format(parseISO(expense.expense_date), "MMM d")}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          {`${symbols.get(expense.currency) ?? expense.currency} ${amountFormatter.format(
            expense.amount,
          )}`}
        </ItemActions>
      </Item>
    )),
  );
}
