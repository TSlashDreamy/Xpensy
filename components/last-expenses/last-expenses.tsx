import { RiArrowRightSLine as ArrowIcon } from "@remixicon/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { UserExpense } from "@/lib/actions/getExpenses";

export default async function LastExpenses() {
  // TODO: Render the real expenses once the list is ready
  const latestExpenses = null as UserExpense[] | null;

  if (!latestExpenses) return null;

  return latestExpenses.map((expense) => (
    <Item key={expense.id}>
      <ItemMedia>
        <Avatar>
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Visit our documentation</ItemTitle>
        <ItemDescription>
          Learn how to get started with your components.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <ArrowIcon className="size-4" />
      </ItemActions>
    </Item>
  ));
}
