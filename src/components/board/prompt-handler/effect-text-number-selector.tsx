import { useLanguageContext } from "@/components/contexts/language-context";
import type { SelectionItem } from "@/shared/api";
import { cn } from "@/utils/cn";
import { HotkeyScope } from "@/utils/hotkey";
import { useHotkeys } from "react-hotkeys-hook";
import { Card, CARD_TEXT_MARKER_CLASS_NAME, CardTextMarker } from "../card";
import type { NumberBox } from "@/utils/translate";

type EffectTextNumberOption = Extract<
  SelectionItem,
  { type: "effectTextNumber" }
>;

interface EffectTextNumberSelectorProps {
  options: EffectTextNumberOption[];
  selectedOptions: SelectionItem[];
  onPress: (option: EffectTextNumberOption) => void;
}

export function isEffectTextNumberSelection(
  options: SelectionItem[],
): options is EffectTextNumberOption[] {
  if (options.length === 0 || options[0]?.type !== "effectTextNumber") {
    return false;
  }

  const cardId = options[0].payload.card.globalId;
  return options.every(
    (option) =>
      option.type === "effectTextNumber" &&
      option.payload.card.globalId === cardId,
  );
}

export function EffectTextNumberSelector({
  options,
  selectedOptions,
  onPress,
}: EffectTextNumberSelectorProps) {
  const card = options[0]?.payload.card;
  const { numberBoxes } = useLanguageContext();
  if (!card) return null;

  return (
    <div className="relative">
      <Card card={card} className="shadow-lg/30" size={42} />
      {options.map((option, index) => (
        <EffectTextNumberButton
          key={option.payload.occurrenceIndex}
          box={numberBoxes[card.slug][option.payload.occurrenceIndex]}
          hotkey={index < 10 ? `${(index + 1) % 10}` : undefined}
          isSelected={selectedOptions.includes(option)}
          onClick={() => onPress(option)}
        />
      ))}
    </div>
  );
}

interface EffectTextNumberButtonProps {
  box: NumberBox;
  hotkey?: string;
  isSelected: boolean;
  onClick: () => void;
}

function EffectTextNumberButton({
  box,
  hotkey,
  isSelected,
  onClick,
}: EffectTextNumberButtonProps) {
  useHotkeys(hotkey ?? "", onClick, {
    scopes: [HotkeyScope.Popup],
    enabled: hotkey !== undefined,
  });

  return (
    <CardTextMarker bounds={box}>
      <button
        type="button"
        aria-label={`Select ${box.value}`}
        onClick={onClick}
        className={cn(
          CARD_TEXT_MARKER_CLASS_NAME,
          "cursor-pointer transition-opacity duration-100",
          isSelected
            ? "outline-6 outline-blue-400"
            : "hover:backdrop-brightness-120",
        )}
      />
    </CardTextMarker>
  );
}
