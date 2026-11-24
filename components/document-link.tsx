import type { ComponentPropsWithoutRef } from "react";

// These routes are independent documents. Native navigation also works in the
// vinext preview, where client-side RSC navigation is not always available.
export default function DocumentLink(props: ComponentPropsWithoutRef<"a">) {
  return <a {...props} />;
}
