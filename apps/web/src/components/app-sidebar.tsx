import {
  Analytics01Icon,
  ArrowUpRight01Icon,
  Book02Icon,
  Building03Icon,
  Call02Icon,
  Cancel01Icon,
  File02Icon,
  GalleryVerticalIcon,
  HandBag01Icon,
  LoginSquare01Icon,
  Mail02Icon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  Settings02Icon,
  User03Icon,
  UserGroup02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";

import { Separator } from "@inqra/ui/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@inqra/ui/components/sidebar";

import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@inqra/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@inqra/ui/components/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@inqra/ui/components/dialog";
import { Button } from "@inqra/ui/components/button";
import { Badge } from "@inqra/ui/components/badge";
import { Link } from "@tanstack/react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile, toggleSidebar } = useSidebar();

  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <Sidebar {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:p-3.5! [&_svg]:size-5"
              >
                <React.Activity
                  mode={state === "expanded" ? "visible" : "hidden"}
                >
                  <HugeiconsIcon icon={GalleryVerticalIcon} />
                  <span>Inqra</span>

                  <div
                    data-sidebar="trigger"
                    data-slot="sidebar-trigger"
                    onClick={() => toggleSidebar()}
                    className={cn(
                      "group/button rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none",
                      "inline-flex shrink-0 items-center justify-center",
                      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
                      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
                      "aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3",
                      "disabled:pointer-events-none disabled:opacity-50",
                      "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
                      "active:not-aria-[haspopup]:translate-y-px",
                      "size-8 rounded-[min(var(--radius-md),10px)]",
                      "ml-auto"
                    )}
                  >
                    <HugeiconsIcon icon={PanelLeftOpenIcon} />
                    <span className="sr-only">Toggle Sidebar</span>
                  </div>
                </React.Activity>

                <React.Activity
                  mode={state === "collapsed" ? "visible" : "hidden"}
                >
                  <div
                    data-sidebar="trigger"
                    data-slot="sidebar-trigger"
                    onClick={() => toggleSidebar()}
                  >
                    <HugeiconsIcon icon={PanelLeftCloseIcon} />
                    <span className="sr-only">Toggle Sidebar</span>
                  </div>
                </React.Activity>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    render={() => <Link to="/app" />}
                    className="text-muted-foreground group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:p-3.5! [&_svg]:size-5"
                    isActive
                  >
                    <HugeiconsIcon icon={File02Icon} />
                    <span className="max-sm:sr-only">Work Station</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    className="text-muted-foreground group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:p-3.5! [&_svg]:size-5"
                  >
                    <HugeiconsIcon icon={Analytics01Icon} />
                    <span className="max-sm:sr-only">Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    className="text-muted-foreground group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:p-3.5! [&_svg]:size-5"
                  >
                    <HugeiconsIcon icon={Settings02Icon} />
                    <span className="max-sm:sr-only">การจัดการ</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    className="text-muted-foreground group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:p-3.5! [&_svg]:size-5"
                  >
                    <HugeiconsIcon icon={Book02Icon} />
                    <span className="max-sm:sr-only">คู่มือการใช้งานระบบ</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator />

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    className="text-muted-foreground group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:p-3.5! [&_svg]:size-5"
                  >
                    <HugeiconsIcon icon={ArrowUpRight01Icon} />
                    <span className="max-sm:sr-only">ไปยัง Adjest level</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="group-data-[collapsible=icon]:pl-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="blur-in-xs border border-[#FFFFFF] bg-transparent bg-linear-to-b from-[#FFFFFF] from-80% to-[#FFFFFF] to-50% shadow-2xs shadow-[#BBD3C91A]"
                    />
                  }
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="shadcn"
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">shadcn</span>
                    <span className="truncate text-xs">Admin</span>
                  </div>

                  <HugeiconsIcon
                    icon={LoginSquare01Icon}
                    className="text-destructive ml-auto size-5"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem
                    onClick={() => setOpen(true)}
                    className="focus:bg-[#EDF6F5] focus:text-[#0D8A72] not-data-[variant=destructive]:focus:**:text-[#0D8A72]"
                  >
                    <HugeiconsIcon
                      icon={UserIcon}
                      className="size-5 text-[#0D8A72]"
                    />
                    <span>โปรไฟล์ผู้ใช้งาน</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem variant="destructive">
                    <HugeiconsIcon
                      icon={LoginSquare01Icon}
                      className="text-destructive size-5"
                    />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="bg-[#FFFFFF] p-0 shadow-[0px_4px_30px_0px_#3CB52C12] ring-0 sm:max-w-2xl"
        >
          <DialogHeader className="group/card-header @container/card-header grid h-16 auto-rows-min flex-row items-center gap-1 rounded-t-xl bg-linear-to-b from-[#EEFBF3] to-[#FFFFFF] p-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]">
            <div className="flex flex-row items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                className="size-12 rounded-full bg-linear-to-b from-[#DEFFE0] to-[#EAFFEB] shadow-[inset_0px_-4px_5.7px_0px_#0D8A7240]"
              >
                <HugeiconsIcon
                  icon={User03Icon}
                  className="size-8 text-[#0D8A72]"
                />
              </Button>

              <DialogTitle className="truncate text-xl">ข้อมูลโปรไฟล์</DialogTitle>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="col-start-2 row-span-2 row-start-1 size-12 self-center-safe justify-self-end rounded-full"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-6" />
            </Button>
          </DialogHeader>

          <div className="grid gap-6 px-6 pb-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <Avatar className="size-28.5 rounded-full">
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 gap-2 text-center text-sm leading-tight">
                <span className="truncate text-2xl font-medium">shadcn</span>
                <Badge className="truncate bg-[#EDF6F5] text-[#0D8A72]">
                  รหัสพนักงาน : 66124
                </Badge>
              </div>
            </div>

            <div className="rounded-xl bg-[#E9F6F5]">
              <div className="grid grid-cols-[auto_1fr] items-center gap-2 p-4">
                <Button
                  type="button"
                  variant="outline"
                  className="size-10 rounded-full border-none"
                >
                  <HugeiconsIcon
                    icon={User03Icon}
                    className="size-6 text-[#0D8A72]"
                  />
                </Button>

                <DialogTitle className="truncate text-xl">
                  รายละเอียดข้อมูล
                </DialogTitle>
              </div>

              <div className="bg-background rounded-b-xl p-4 shadow-xs">
                <div className="backdropblur-[0px_0px_1px_0px_#28293D14] grid auto-rows-auto grid-cols-2 gap-4 rounded-xl bg-[#FBFBFB] p-4 shadow-[0px_0.5px_2px_0px_#60617029]">
                  <div className="text-muted-foreground grid items-start gap-2 text-sm">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
                      <HugeiconsIcon icon={HandBag01Icon} className="size-5" />
                      <span>ตำแหน่ง</span>
                    </div>
                    <div className="text-foreground font-medium">
                      Business Analyst
                    </div>
                  </div>

                  <div className="text-muted-foreground grid items-start gap-2 text-sm">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
                      <HugeiconsIcon
                        icon={UserGroup02Icon}
                        className="size-5"
                      />
                      <span>หน่วยงาน</span>
                    </div>
                    <div className="text-foreground font-medium">
                      พัฒนาธุรกิจ Software
                    </div>
                  </div>

                  <div className="text-muted-foreground grid items-start gap-2 text-sm">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
                      <HugeiconsIcon icon={Building03Icon} className="size-5" />
                      <span>บริษัท</span>
                    </div>
                    <div className="text-foreground font-medium">
                      อินเทอร์เน็ตประเทศไทย จำกัด (มหาชน)
                    </div>
                  </div>

                  <div className="text-muted-foreground grid items-start gap-2 text-sm">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
                      <HugeiconsIcon icon={Mail02Icon} className="size-5" />
                      <span>อีเมล</span>
                    </div>
                    <div className="text-foreground font-medium">
                      TanaponKaew@inet.co.th
                    </div>
                  </div>

                  <div className="text-muted-foreground grid items-start gap-2 text-sm">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
                      <HugeiconsIcon icon={Call02Icon} className="size-5" />
                      <span>เบอร์โทร</span>
                    </div>
                    <div className="text-foreground font-medium">
                      08642159764
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
