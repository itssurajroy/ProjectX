
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Button, type ButtonProps } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

/* -------------------------------------------------------------------------- */
/*                                  PROVIDER                                  */
/* -------------------------------------------------------------------------- */
type SidebarContextValue = {
  isExpanded: boolean
  isMobile: boolean
  variant: "default" | "inset"
  onToggle?: () => void
  onClose?: () => void
}
const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

type SidebarProviderProps = React.PropsWithChildren<{
  isExpanded?: boolean
  variant?: "default" | "inset"
  onToggle?: () => void
}>

export function SidebarProvider({
  children,
  isExpanded: isExpandedProp,
  onToggle,
  variant = "default",
}: SidebarProviderProps) {
  const isMobile = useIsMobile()
  const [isExpanded, setIsExpanded] = React.useState(isExpandedProp ?? !isMobile)

  const handleToggle = () => {
    if (isMobile) {
      setIsExpanded(true)
      return
    }
    setIsExpanded((prev) => !prev)
    onToggle?.()
  }

  const handleClose = () => {
    if (isMobile) {
      setIsExpanded(false)
    }
  }

  React.useEffect(() => {
    if (isMobile) {
      setIsExpanded(false)
    } else {
      setIsExpanded(true)
    }
  }, [isMobile])

  React.useEffect(() => {
    if (isExpandedProp !== undefined) {
      setIsExpanded(isExpandedProp)
    }
  }, [isExpandedProp])

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        isMobile,
        onToggle: handleToggle,
        onClose: handleClose,
        variant,
      }}
    >
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   SIDEBAR                                  */
/* -------------------------------------------------------------------------- */
const sidebarVariants = cva(
  "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "",
        inset: "left-4 top-4 h-[calc(100vh-2rem)] rounded-xl border",
      },
      isExpanded: {
        true: "w-64",
        false: "w-[3.35rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      isExpanded: true,
    },
  }
)

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isExpanded, variant, isMobile } = useSidebar()
  const state = isExpanded ? "expanded" : "collapsed"
  if (isMobile) {
    return (
      <div
        data-state={state}
        data-variant={variant}
        className="peer fixed inset-0 z-30"
        {...(isExpanded && { onClick: props.onClick })}
      >
        <div
          ref={ref}
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 translate-x-0 border-r bg-card shadow-lg transition-transform duration-300 ease-in-out",
            !isExpanded && "-translate-x-full",
            className
          )}
          {...props}
        />
      </div>
    )
  }
  return (
    <div
      ref={ref}
      data-state={state}
      data-variant={variant}
      className={cn(
        "peer",
        sidebarVariants({ isExpanded, variant }),
        className
      )}
      {...props}
    />
  )
})
Sidebar.displayName = "Sidebar"

/* -------------------------------------------------------------------------- */
/*                                   HEADER                                   */
/* -------------------------------------------------------------------------- */
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isExpanded } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-14 items-center px-4",
        !isExpanded && "px-3",
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

/* -------------------------------------------------------------------------- */
/*                                   CONTENT                                  */
/* -------------------------------------------------------------------------- */
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

/* -------------------------------------------------------------------------- */
/*                                   TRIGGER                                  */
/* -------------------------------------------------------------------------- */
function SidebarTrigger({
  className,
  children,
  ...props
}: ButtonProps & {
  children?: React.ReactNode
}) {
  const { onToggle, isExpanded } = useSidebar()
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(className)}
      onClick={onToggle}
      {...props}
    >
      {children ?? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("lucide lucide-panel-left-close size-5")}
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 3v18" />
          <path d="m16 15-3-3 3-3" />
        </svg>
      )}
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    MENU                                    */
/* -------------------------------------------------------------------------- */
const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, children, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {children}
    </ul>
  )
})
SidebarMenu.displayName = "SidebarMenu"

/* -------------------------------------------------------------------------- */
/*                                    GROUP                                   */
/* -------------------------------------------------------------------------- */
const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    heading?: React.ReactNode
  }
>(({ className, children, heading, ...props }, ref) => {
  const { isExpanded } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {heading && (
        <div
          className={cn(
            "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
            isExpanded ? "px-4" : "px-3"
          )}
        >
          {isExpanded || isExpanded === undefined ? (
            heading
          ) : (
            <div className="mx-auto my-2 w-6 border-b" />
          )}
        </div>
      )}
      {children}
    </div>
  )
})
SidebarGroup.displayName = "SidebarGroup"

/* -------------------------------------------------------------------------- */
/*                                 MENU ITEM                                  */
/* -------------------------------------------------------------------------- */
type SidebarMenuItemProps = {
  isActive?: boolean
  className?: string
  children: React.ReactNode
  asChild?: boolean
}
function SidebarMenuItem({
  children,
  className,
  isActive,
  ...props
}: SidebarMenuItemProps) {
  return (
    <li className={cn("relative", className)} {...props}>
      {children}
    </li>
  )
}
/* -------------------------------------------------------------------------- */
/*                                MENU BUTTON                                 */
/* -------------------------------------------------------------------------- */
const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    isActive?: boolean;
    icon?: React.ReactNode;
    label: string;
  }
>(({ className, isActive, icon, label, children, ...props }, ref) => {
  const { isExpanded } = useSidebar();
  const child = children ? React.Children.only(children) : null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "h-9 justify-start gap-3 whitespace-nowrap",
            !isExpanded && "h-10 w-10 justify-center p-0",
            className
          )}
          {...props}
          asChild={!!child}
        >
          {child ? (
             React.cloneElement(child as React.ReactElement, {}, (
              <>
                {icon && React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4 shrink-0" })}
                {isExpanded && (
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {label}
                  </span>
                )}
                {/* Render other children passed to the button, like a badge */}
                {React.Children.toArray((child.props as any).children).filter(c => c !== label && c !== icon)}
              </>
            ))
          ) : (
            <>
              {icon && React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4 shrink-0" })}
              {isExpanded && (
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {label}
                </span>
              )}
            </>
          )}
        </Button>
      </TooltipTrigger>
      {!isExpanded && (
        <TooltipContent
          side="right"
          sideOffset={10}
          className="bg-background text-foreground"
        >
          {label}
        </TooltipContent>
      )}
    </Tooltip>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
}

    