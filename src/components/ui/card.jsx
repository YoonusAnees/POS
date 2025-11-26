import React from "react";
import clsx from "clsx";

export const Card = React.forwardRef(({ 
  className, 
  children, 
  variant = "default",
  hover = false,
  padding = "default",
  shadow = "default",
  border = true,
  ...props 
}, ref) => {
  
  const variants = {
    default: "bg-white border-gray-200",
    elevated: "bg-white border-gray-100 shadow-lg",
    glass: "bg-white/70 backdrop-blur-xl border-white/50",
    gradient: "bg-gradient-to-br from-white to-gray-50 border-gray-100",
    dark: "bg-gray-900 border-gray-700 text-white",
    success: "bg-emerald-50 border-emerald-200",
    warning: "bg-amber-50 border-amber-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200"
  };

  const paddings = {
    none: "p-0",
    tight: "p-3",
    default: "p-6",
    comfortable: "p-8",
    loose: "p-10"
  };

  const shadows = {
    none: "shadow-none",
    subtle: "shadow-sm",
    default: "shadow-md",
    elevated: "shadow-lg",
    floating: "shadow-xl",
    glow: "shadow-2xl shadow-emerald-500/10"
  };

  const hoverEffects = {
    default: "hover:shadow-lg hover:-translate-y-0.5",
    lift: "hover:shadow-xl hover:-translate-y-1",
    glow: "hover:shadow-2xl hover:shadow-emerald-500/20",
    scale: "hover:scale-[1.02] hover:shadow-lg",
    none: ""
  };

  return (
    <div
      ref={ref}
      className={clsx(
        "rounded-2xl transition-all duration-300",
        border && "border",
        variants[variant],
        paddings[padding],
        shadows[shadow],
        hover && hoverEffects[hover],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

// Card Header Component
export const CardHeader = React.forwardRef(({ 
  className, 
  children, 
  title,
  description,
  action,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={clsx(
      "flex items-start justify-between mb-6",
      className
    )}
    {...props}
  >
    <div className="flex-1">
      {title && (
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-gray-600">
          {description}
        </p>
      )}
      {children}
    </div>
    {action && (
      <div className="flex-shrink-0 ml-4">
        {action}
      </div>
    )}
  </div>
));

CardHeader.displayName = "CardHeader";

// Card Content Component
export const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("text-gray-700", className)}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = "CardContent";

// Card Footer Component
export const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "flex items-center justify-between pt-6 mt-6 border-t border-gray-100",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = "CardFooter";

// Card Title Component
export const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={clsx(
      "text-2xl font-bold text-gray-900 mb-2",
      className
    )}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = "CardTitle";

// Card Description Component
export const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={clsx(
      "text-sm text-gray-600 mb-4",
      className
    )}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = "CardDescription";

// Usage Examples Component (for demonstration)
export const CardDemo = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50 min-h-screen">
      
      {/* Default Card */}
      <Card>
        <CardHeader title="Default Card" />
        <CardContent>
          <p>This is a basic card with default styling.</p>
        </CardContent>
      </Card>

      {/* Elevated Card with Hover */}
      <Card variant="elevated" hover="lift">
        <CardHeader 
          title="Elevated Card" 
          description="With lift hover effect"
        />
        <CardContent>
          <p>Hover over this card to see the lift effect.</p>
        </CardContent>
      </Card>

      {/* Glass Card */}
      <Card variant="glass" hover="glow">
        <CardHeader 
          title="Glass Card" 
          description="With backdrop blur effect"
        />
        <CardContent>
          <p>Perfect for modern glassmorphism designs.</p>
        </CardContent>
      </Card>

      {/* Success Card */}
      <Card variant="success" padding="comfortable">
        <CardHeader title="Success State" />
        <CardContent>
          <p>Use this for positive actions or successful states.</p>
        </CardContent>
      </Card>

      {/* Warning Card */}
      <Card variant="warning" shadow="glow">
        <CardHeader title="Warning State" />
        <CardContent>
          <p>Perfect for warning messages or alerts.</p>
        </CardContent>
      </Card>

      {/* Gradient Card */}
      <Card variant="gradient" hover="scale">
        <CardHeader 
          title="Gradient Background" 
          action={<button className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-sm">Action</button>}
        />
        <CardContent>
          <p>Features a subtle gradient background and scale hover effect.</p>
        </CardContent>
        <CardFooter>
          <span className="text-sm text-gray-500">Card Footer</span>
          <button className="text-emerald-600 font-semibold">Learn More</button>
        </CardFooter>
      </Card>

      {/* No Border Card */}
      <Card border={false} shadow="floating" padding="loose">
        <CardHeader title="No Border" />
        <CardContent>
          <p>This card has no border but uses shadow for definition.</p>
        </CardContent>
      </Card>

      {/* Tight Padding Card */}
      <Card padding="tight" hover="default">
        <CardHeader title="Compact" />
        <CardContent>
          <p>Uses tight padding for compact layouts.</p>
        </CardContent>
      </Card>

      {/* Dark Theme Card */}
      <Card variant="dark" shadow="elevated">
        <CardTitle>Dark Theme</CardTitle>
        <CardDescription>
          Perfect for dark mode interfaces
        </CardDescription>
        <CardContent>
          <p>This card uses dark theme styling.</p>
        </CardContent>
      </Card>

    </div>
  );
};

export default Card;