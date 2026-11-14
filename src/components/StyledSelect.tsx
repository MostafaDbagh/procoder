"use client";

import { useId, useRef, useState, useEffect, useLayoutEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

import { createPortal } from "react-dom";
import type { CSSProperties } from "react";

type Option = { value: string; label: string };
export function StyledSelect({ label, value, options, onChange, placeholder, disabled = false, required = false, invalid = false, dir = "ltr" }: {
 label: string; value: string; options: Option[]; onChange?: (value: string) => void;
 placeholder: string; disabled?: boolean; required?: boolean; invalid?: boolean; dir?: "rtl" | "ltr";
}) {
 const id = useId();
 const menu = useRef<HTMLDivElement>(null);
 const search = useRef({ text: "", time: 0 });
 const [position, setPosition] = useState<CSSProperties>({});
 const root = useRef<HTMLDivElement>(null);
 const trigger = useRef<HTMLButtonElement>(null);
 const [open, setOpen] = useState(false);
 const [active, setActive] = useState(0);
 const selected = options.findIndex(option => option.value === value);
 const expanded = open && !disabled;
 useEffect(() => {
  if (!expanded) return;
  const close = (event: PointerEvent) => {
   if (!root.current?.contains(event.target as Node) && !menu.current?.contains(event.target as Node)) setOpen(false);
  };
  document.addEventListener("pointerdown", close);
  return () => document.removeEventListener("pointerdown", close);
 }, [expanded]);
 useEffect(() => {
  if (!expanded) return;
  const list = menu.current;
  const option = list?.querySelector<HTMLElement>(`[data-option-index="${active}"]`);
  if (!list || !option) return;
  // Scroll only the menu; scrollIntoView can also move the page behind a modal.
  const bounds = list.getBoundingClientRect();
  const item = option.getBoundingClientRect();
  const top = bounds.top + list.clientTop;
  const bottom = top + list.clientHeight;
  if (item.top < top) list.scrollTop -= top - item.top;
  else if (item.bottom > bottom) list.scrollTop += item.bottom - bottom;
 }, [active, expanded]);
 const choose = (index: number) => {
  onChange?.(options[index].value);
  setOpen(false);
  trigger.current?.focus({ preventScroll: true });
 };
 useLayoutEffect(() => {
  if (!expanded) return;
  const reposition = () => {
   const rect = trigger.current?.getBoundingClientRect();
   if (!rect) return;
   const below = window.innerHeight - rect.bottom - 16;
   const above = rect.top - 16;
   const upward = below < 240 && above > below;
   setPosition({ position: "fixed", left: rect.left, width: rect.width,
    maxHeight: Math.min(288, Math.max(80, upward ? above : below)),
    ...(upward ? { bottom: window.innerHeight - rect.top + 8 } : { top: rect.bottom + 8 }) });
  };
  reposition();
  const onScroll = (event: Event) => { if (!menu.current?.contains(event.target as Node)) reposition(); };
  window.addEventListener("resize", reposition);
  document.addEventListener("scroll", onScroll, true);
  return () => { window.removeEventListener("resize", reposition); document.removeEventListener("scroll", onScroll, true); };
 }, [expanded]);
 return (
  <div ref={root} dir={dir} className="relative" onBlur={event => {
   if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
   <button ref={trigger} type="button" role="combobox" aria-label={label}
    aria-required={required} aria-invalid={invalid || undefined}
    aria-controls={expanded ? `${id}-options` : undefined} aria-haspopup="listbox" aria-expanded={expanded}
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
      if (event.key === "Escape" && expanded) { event.preventDefault(); event.stopPropagation(); }
      setOpen(false);
     } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      const now = Date.now();
      search.current.text = now - search.current.time < 600 ? search.current.text + event.key : event.key;
      search.current.time = now;
      const index = options.findIndex(option => option.label.toLocaleLowerCase().startsWith(search.current.text.toLocaleLowerCase()));
      if (index >= 0) { setOpen(true); setActive(index); }
     }
    }}
    className={`flex min-h-12 w-full items-center gap-3 rounded-xl border bg-background px-4 py-3 text-start text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-80 ${invalid ? "border-red-400" : expanded ? "border-primary ring-2 ring-primary/10" : "border-border hover:border-primary/50"}`}
   >
    <span className={`min-w-0 flex-1 break-words ${selected >= 0 ? "text-foreground" : "text-muted"}`}>
     {selected >= 0 ? options[selected].label : placeholder}
    </span>
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${selected >= 0 ? "bg-primary/10 text-primary" : "bg-background text-muted"}`}>
     <ChevronDown aria-hidden className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
    </span>
   </button>
   {expanded && createPortal(
    <div ref={menu} style={position} dir={dir} id={`${id}-options`} role="listbox" aria-label={label}
     className="z-[200] overflow-y-auto overscroll-contain rounded-2xl border border-primary/20 bg-surface p-2 shadow-xl shadow-black/10">
     {options.map((option, index) => (
      <div key={option.value} id={`${id}-option-${index}`} role="option" aria-selected={option.value === value}
       data-option-index={index} onPointerMove={() => setActive(index)}
       onMouseDown={event => event.preventDefault()} onClick={() => choose(index)}
       className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm leading-relaxed transition-colors ${option.value === value ? "bg-primary text-white" : active === index ? "bg-primary/10 text-foreground" : "text-foreground hover:bg-primary/5"}`}>
       <span className="min-w-0 flex-1 break-words">{option.label}</span>
       {option.value === value && <Check aria-hidden className="h-4 w-4 shrink-0" />}
      </div>
     ))}
    </div>, document.body
   )}
  </div>
 );
}
