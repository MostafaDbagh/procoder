"use client";

import { useId, useRef, useState, useEffect } from "react";
import { Check, ChevronDown, CircleHelp } from "lucide-react";

type Option = { value: string; label: string };
export function ReadinessSelect({ label, value, options, onChange, placeholder, disabled }: {
 label: string; value: string; options: Option[]; onChange: (value: string) => void;
 placeholder: string; disabled: boolean;
}) {
 const id = useId();
 const root = useRef<HTMLDivElement>(null);
 const trigger = useRef<HTMLButtonElement>(null);
 const [open, setOpen] = useState(false);
 const [active, setActive] = useState(0);
 const selected = options.findIndex(option => option.value === value);
 const expanded = open && !disabled;
 useEffect(() => {
  if (!expanded) return;
  const close = (event: PointerEvent) => {
   if (!root.current?.contains(event.target as Node)) setOpen(false);
  };
  document.addEventListener("pointerdown", close);
  return () => document.removeEventListener("pointerdown", close);
 }, [expanded]);
 useEffect(() => {
  if (expanded) root.current?.querySelector(`[data-option-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
 }, [active, expanded]);
 const choose = (index: number) => {
  onChange(options[index].value);
  setOpen(false);
  trigger.current?.focus({ preventScroll: true });
 };
 return (
  <div ref={root} className="relative" onBlur={event => {
   if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
   <button ref={trigger} type="button" role="combobox" aria-label={label}
    aria-controls={`${id}-options`} aria-haspopup="listbox" aria-expanded={expanded}
    aria-activedescendant={expanded ? `${id}-option-${active}` : undefined}
    disabled={disabled} onClick={() => { setActive(Math.max(selected, 0)); setOpen(!open); }}
    onKeyDown={event => {
     if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      setActive(current => event.key === "Home" ? 0 : event.key === "End" ? options.length - 1
       : !expanded ? Math.max(selected, event.key === "ArrowUp" ? options.length - 1 : 0)
       : (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
     } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (expanded) choose(active); else { setActive(Math.max(selected, 0)); setOpen(true); }
     } else if (event.key === "Escape" || event.key === "Tab") {
      if (event.key === "Escape" && expanded) event.preventDefault();
      setOpen(false);
     } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      const index = options.findIndex(option => option.label.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));
      if (index >= 0) { setOpen(true); setActive(index); }
     }
    }}
    className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 bg-surface px-4 py-3 text-start text-sm leading-relaxed transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-wait ${expanded ? "border-primary shadow-sm" : "border-border hover:border-primary/40"}`}
   >
    <span className={`min-w-0 flex-1 break-words ${selected >= 0 ? "font-semibold text-foreground" : "text-muted"}`}>
     {selected >= 0 ? options[selected].label : placeholder}
    </span>
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${selected >= 0 ? "bg-primary/10 text-primary" : "bg-background text-muted"}`}>
     <ChevronDown aria-hidden className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
    </span>
   </button>
   {expanded && (
    <div id={`${id}-options`} role="listbox" aria-label={label}
     className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-y-auto overscroll-contain rounded-2xl border-2 border-primary/20 bg-surface p-2 shadow-xl shadow-black/10">
     {options.map((option, index) => (
      <div key={option.value} id={`${id}-option-${index}`} role="option" aria-selected={option.value === value}
       data-option-index={index} onPointerMove={() => setActive(index)}
       onMouseDown={event => event.preventDefault()} onClick={() => choose(index)}
       className={`flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3 text-sm leading-relaxed transition-colors ${active === index ? "bg-primary/10 text-foreground" : "text-muted hover:bg-primary/5"} ${option.value === "unsure" ? "mt-1 border-t border-border" : ""}`}>
       <span aria-hidden className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${option.value === value ? "bg-primary text-white" : "border border-border bg-background"}`}>
        {option.value === value ? <Check className="h-3 w-3" /> : option.value === "unsure" ? <CircleHelp className="h-3 w-3" /> : <span className="text-[10px] font-bold">{index + 1}</span>}
       </span>
       <span className="min-w-0 break-words">{option.label}</span>
      </div>
     ))}
    </div>
   )}
  </div>
 );
}
