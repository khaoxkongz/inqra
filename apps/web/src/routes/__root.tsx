import { Toaster } from "@inqra/ui/components/sonner";
import type { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  createRootRouteWithContext,
  useNavigate,
  useParams,
} from "@tanstack/react-router";

import { ThemeProvider, useTheme } from "@/components/theme-provider";
import type { trpc } from "@/utils/trpc";

import { AuthProvider } from "@/components/auth/auth-provider";
import { authClient } from "@/lib/auth-client";
import { apiKeyPlugin } from "@/lib/auth/api-key-plugin";
import { deleteUserPlugin } from "@/lib/auth/delete-user-plugin";
import { magicLinkPlugin } from "@/lib/auth/magic-link-plugin";
import { multiSessionPlugin } from "@/lib/auth/multi-session-plugin";
import { organizationPlugin } from "@/lib/auth/organization-plugin";
import { passkeyPlugin } from "@/lib/auth/passkey-plugin";
import { themePlugin } from "@/lib/auth/theme-plugin";
import { usernamePlugin } from "@/lib/auth/username-plugin";
import "../index.css";

export interface RouterAppContext {
  trpc: typeof trpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "inqra",
      },
      {
        name: "description",
        content: "inqra is a web application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });

  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <AuthProvider
          authClient={authClient}
          redirectTo="/settings/account"
          socialProviders={["google"]}
          emailAndPassword={{ requireEmailVerification: false }}
          navigate={navigate}
          plugins={[
            usernamePlugin({
              usernamePrefix: "@",
              localization: { usernamePlaceholder: "username" },
            }),
            magicLinkPlugin(),
            passkeyPlugin(),
            apiKeyPlugin({ organization: true }),
            themePlugin({ useTheme }),
            multiSessionPlugin(),
            deleteUserPlugin(),
            organizationPlugin({
              slugPrefix: "@",
              slug: params?.id ?? null,
            }),
          ]}
          Link={({ href, ...props }) => <Link to={href} {...props} />}
        >
          <div className="relative">
            <div className="isolate flex min-h-svh flex-col antialiased">
              <Outlet />
            </div>
          </div>
          <Toaster richColors />
        </AuthProvider>
      </ThemeProvider>
      {/* <TanStackRouterDevtools position="bottom-left"  /> */}
      {/* <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" /> */}
    </>
  );
}
