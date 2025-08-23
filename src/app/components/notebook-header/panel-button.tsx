import * as React from "react";
import {Slot, type SlotProps} from "@radix-ui/react-slot";
import {cn} from "@/app/lib/utils";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/app/components/ui/tooltip";
import buttonVariants, {type ButtonVariants} from "@/app/components/notebook-header/const/button-variants";
import type {VariantProps} from "class-variance-authority";


export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<ButtonVariants> {
    asChild?: boolean;
    tooltip?: string;
}

const PanelButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({className, variant, size, asChild = false, tooltip, ...props}, ref) => {
        const Comp = asChild ? Slot : "button";
        const button = (
            <Comp
                className={cn(buttonVariants({variant, size, className}))}
                ref={ref}
                {...props as SlotProps}
            />
        );

        if (tooltip) {
            return (
                <Tooltip>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            );
        }

        return button;
    }
);
PanelButton.displayName = "PanelButton";

export {PanelButton};