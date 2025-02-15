"use client"

import { useState, useEffect, useMemo } from "react"
import { Country, State, City } from "country-state-city"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
interface LocationItem {
  name: string
}

interface CountryItem extends LocationItem {
  isoCode: string
}

interface StateItem extends LocationItem {
  isoCode: string
}


interface LocationSelectorProps {
  onSelect: (country: string, state: string, city: string) => void
}

export default function LocationSelector({ onSelect }: LocationSelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [countrySearch, setCountrySearch] = useState("")
  const [stateSearch, setStateSearch] = useState("")
  const [citySearch, setCitySearch] = useState("")

  const filteredCountries = useMemo(() => {
    return Country.getAllCountries().filter((country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()),
    )
  }, [countrySearch])

  const filteredStates = useMemo(() => {
    return State.getStatesOfCountry(selectedCountry).filter((state) =>
      state.name.toLowerCase().includes(stateSearch.toLowerCase()),
    )
  }, [selectedCountry, stateSearch])

  const filteredCities = useMemo(() => {
    return City.getCitiesOfState(selectedCountry, selectedState).filter((city) =>
      city.name.toLowerCase().includes(citySearch.toLowerCase()),
    )
  }, [selectedCountry, selectedState, citySearch])

  useEffect(() => {
    onSelect(selectedCountry, selectedState, selectedCity)
  }, [selectedCountry, selectedState, selectedCity, onSelect])

  return (
    <div className="space-y-2">
      <LocationField<CountryItem>
        label="Country"
        placeholder="Search country..."
        items={filteredCountries}
        onSearch={setCountrySearch}
        onSelect={(country) => {
          setSelectedCountry(country.isoCode)
          setSelectedState("")
          setSelectedCity("")
        }}
        disabled={false}
        value={selectedCountry}
      />
      <LocationField<StateItem>
        label="State"
        placeholder="Search state..."
        items={filteredStates}
        onSearch={setStateSearch}
        onSelect={(state) => {
          setSelectedState(state.isoCode)
          setSelectedCity("")
        }}
        disabled={!selectedCountry}
        value={selectedState}
      />
      <LocationField<LocationItem>
        label="City"
        placeholder="Search city..."
        items={filteredCities}
        onSearch={setCitySearch}
        onSelect={(city) => setSelectedCity(city.name)}
        disabled={!selectedState}
        value={selectedCity}
      />
    </div>
  )
}

interface LocationFieldProps<T extends LocationItem> {
  label: string
  placeholder: string
  items: T[]
  onSearch: (value: string) => void
  onSelect: (item: T) => void
  disabled: boolean
  value: string
}

function LocationField<T extends LocationItem>({
  label,
  placeholder,
  items,
  onSearch,
  onSelect,
  disabled,
  value,
}: LocationFieldProps<T>) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {value ? items.find((item) => ("isoCode" in item ? item.isoCode : item.name) === value)?.name : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <div className="p-2">
            <Input placeholder={placeholder} onChange={(e) => onSearch(e.target.value)} className="mb-2" />
            <ScrollArea className="h-[200px]">
              {items.length === 0 ? (
                <p className="text-sm text-center py-2 text-muted-foreground">No {label.toLowerCase()} found.</p>
              ) : (
                items.map((item) => (
                  <Button
                    key={("isoCode" in item ? item.isoCode : item.name) as string}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      onSelect(item)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === ("isoCode" in item ? item.isoCode : item.name) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {item.name}
                  </Button>
                ))
              )}
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

