import React, { useState } from "react";
import { Control, Controller, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

interface MultiSelectFieldProps<T extends FieldValues> {
    control: Control<T>;
    errors?: FieldErrors<T>;
    name: Path<T>;
    label: string;
}

const insuranceTypesArray = [
    { id: "life", name: "Life Insurance" },
    { id: "term_life", name: "Term Life Insurance" },
    { id: "whole_life", name: "Whole Life Insurance" },
    { id: "universal_life", name: "Universal Life Insurance" },
    { id: "endowment", name: "Endowment Plans" },
    { id: "money_back", name: "Money-Back Plans" },
    { id: "child", name: "Child Plans" },
    { id: "pension", name: "Pension Plans" },

    { id: "health", name: "Health Insurance" },
    { id: "individual_health", name: "Individual Health Insurance" },
    { id: "family_health", name: "Family Floater Health Insurance" },
    { id: "critical_illness", name: "Critical Illness Insurance" },
    { id: "senior_health", name: "Senior Citizen Health Insurance" },
    { id: "group_health", name: "Group Health Insurance" },
    { id: "maternity", name: "Maternity Insurance" },
    { id: "personal_accident", name: "Personal Accident Insurance" },
    { id: "top_up_health", name: "Top-up & Super Top-up Health Insurance" },

    { id: "motor", name: "Motor Insurance" },
    { id: "car", name: "Car Insurance" },
    { id: "two_wheeler", name: "Two-Wheeler Insurance" },
    { id: "commercial_vehicle", name: "Commercial Vehicle Insurance" },

    { id: "property", name: "Property Insurance" },
    { id: "home", name: "Home Insurance" },
    { id: "fire", name: "Fire Insurance" },
    { id: "earthquake", name: "Earthquake Insurance" },
    { id: "flood", name: "Flood Insurance" },
    { id: "renters", name: "Renters Insurance" },
    { id: "landlord", name: "Landlord Insurance" },

    { id: "travel", name: "Travel Insurance" },
    { id: "domestic_travel", name: "Domestic Travel Insurance" },
    { id: "international_travel", name: "International Travel Insurance" },
    { id: "student_travel", name: "Student Travel Insurance" },
    { id: "senior_travel", name: "Senior Citizen Travel Insurance" },
    { id: "family_travel", name: "Family Travel Insurance" },

    { id: "business", name: "Business Insurance" },
    { id: "liability", name: "Liability Insurance" },
    { id: "professional_indemnity", name: "Professional Indemnity Insurance" },
    { id: "workers_compensation", name: "Workers' Compensation Insurance" },
    { id: "commercial_property", name: "Commercial Property Insurance" },
    { id: "cyber", name: "Cyber Insurance" },
    { id: "marine", name: "Marine Insurance" },
    { id: "trade_credit", name: "Trade Credit Insurance" },

    { id: "agriculture", name: "Agriculture Insurance" },
    { id: "crop", name: "Crop Insurance" },
    { id: "livestock", name: "Livestock Insurance" },
    { id: "weather_based", name: "Weather-Based Insurance" },

    { id: "marine_insurance", name: "Marine Insurance" },
    { id: "cargo", name: "Cargo Insurance" },
    { id: "hull", name: "Hull Insurance" },
    { id: "freight", name: "Freight Insurance" },

    { id: "miscellaneous", name: "Miscellaneous Insurance" },
    { id: "gadget", name: "Gadget Insurance" },
    { id: "pet", name: "Pet Insurance" },
    { id: "event", name: "Event Insurance" },
    { id: "film_production", name: "Film Production Insurance" },
    { id: "identity_theft", name: "Identity Theft Insurance" }
];

const MultiSelectField = <T extends FieldValues>({
    control,
    errors,
    name,
    label,
}: MultiSelectFieldProps<T>) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-2">
            <Label className="capitalize">{label}</Label>

            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between"
                            >
                                {insuranceTypesArray.find((item) => item.id === field.value)?.name || "Select an option"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                            <div className="p-2">
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="mb-2"
                                />
                                <ScrollArea className="h-[200px]">
                                    {insuranceTypesArray
                                        .filter((item) =>
                                            item.name.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((item) => (
                                            <Button
                                                key={item.id}
                                                variant="ghost"
                                                className={`w-full justify-start ${
                                                    field.value === item.id ? "bg-gray-300" : ""
                                                }`}
                                                onClick={() => {
                                                    field.onChange(item.id);
                                                    setOpen(false);
                                                }}
                                            >
                                                {item.name}
                                            </Button>
                                        ))}
                                </ScrollArea>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            />

            {/* Error Message */}
            {errors?.[name] && <p className="text-red-500 text-sm">{String(errors[name]?.message)}</p>}
        </div>
    );
};

export default MultiSelectField;
