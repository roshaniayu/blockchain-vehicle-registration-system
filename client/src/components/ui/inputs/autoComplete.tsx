import React, { useState, useEffect, useCallback, useRef } from "react";

// Data set
const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Brazil",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Congo",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Ecuador",
  "Egypt",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Norway",
  "Oman",
  "Pakistan",
  "Panama",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Samoa",
  "San Marino",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Somalia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const App = () => {
  // State for the input value
  const [inputValue, setInputValue] = useState("");
  // State for filtered suggestions
  const [suggestions, setSuggestions] = useState([]);
  // State for keyboard navigation highlight index
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  // State for the finally selected item
  const [selectedCountry, setSelectedCountry] = useState("None");

  // Refs for DOM interaction
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // --- Core Logic ---

  // Function to handle the final selection
  const selectSuggestion = useCallback((countryName) => {
    setInputValue(countryName);
    setSelectedCountry(countryName);
    setSuggestions([]);
    setHighlightedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Function to handle input changes and filter data
  const handleChange = useCallback((e) => {
    const query = e.target.value;
    setInputValue(query);
    setSelectedCountry("None");
    setHighlightedIndex(-1);

    if (query.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const filtered = COUNTRIES.filter((country) =>
      country.toLowerCase().includes(query.toLowerCase().trim())
    );

    setSuggestions(filtered);
  }, []);

  // Effect to handle scrolling for keyboard highlight
  useEffect(() => {
    if (highlightedIndex !== -1 && listRef.current) {
      const item = listRef.current.querySelector(
        `#suggestion-item-${highlightedIndex}`
      );
      if (item) {
        // Scroll the highlighted item into view
        item.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  // Function to handle keyboard navigation
  const handleKeyDown = (e) => {
    const itemsCount = suggestions.length;
    const listIsVisible = itemsCount > 0;

    if (!listIsVisible) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex === itemsCount - 1 ? 0 : prevIndex + 1
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex <= 0 ? itemsCount - 1 : prevIndex - 1
        );
        break;

      case "Enter":
        if (highlightedIndex >= 0) {
          e.preventDefault();
          selectSuggestion(suggestions[highlightedIndex]);
        }
        break;

      case "Escape":
        setSuggestions([]);
        setHighlightedIndex(-1);
        break;

      default:
        break;
    }
  };

  const isListExpanded = suggestions.length > 0;

  return (
    <div className="bg-white min-h-screen flex items-start justify-center p-8 font-sans">
      {/* Autocomplete Container - Simple white card, minimal shadow */}
      <div className="w-full max-w-sm mt-12 border border-gray-200 rounded-xl p-4 shadow-md">
        <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Simple Country Search
        </h1>

        {/* Input Field Wrapper */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for a country..."
            autoComplete="off"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 transition"
            aria-label="Country search input"
            // ARIA attributes
            role="combobox"
            aria-autocomplete="list"
            aria-controls="suggestions-list"
            aria-expanded={isListExpanded}
            aria-activedescendant={
              highlightedIndex >= 0
                ? `suggestion-item-${highlightedIndex}`
                : undefined
            }
          />

          {/* Suggestions Dropdown */}
          {isListExpanded && (
            <div
              id="suggestions-list"
              ref={listRef}
              // Simplified classes: standard border, minimal shadow, use overflow-y-auto
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
              role="listbox"
            >
              {suggestions.map((item, index) => (
                <div
                  key={item}
                  id={`suggestion-item-${index}`}
                  className={`
                                        px-4 py-2 cursor-pointer text-sm truncate
                                        ${
                                          index === highlightedIndex
                                            ? "bg-blue-500 text-white" // Simple blue highlight
                                            : "hover:bg-gray-100 text-gray-800" // Simple hover effect
                                        }
                                    `}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  onClick={() => selectSuggestion(item)}
                  // Use onMouseEnter to update highlight for smooth mouse interaction
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Selected:{" "}
          <span className="font-medium text-blue-600">{selectedCountry}</span>
        </p>
      </div>
    </div>
  );
};

export default App;
