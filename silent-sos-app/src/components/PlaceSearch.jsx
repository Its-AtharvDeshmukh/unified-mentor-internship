import { useState } from "react";
import Icon from "./Icon";
import { searchPlaces, findNetworkArea } from "../lib/locationProviders";
import { useSafety } from "../context/SafetyContext";
export default function PlaceSearch({ allowNetwork = false }) {
  const { location, setToast } = useSafety();
  const [query, setQuery] = useState(""),
    [results, setResults] = useState([]),
    [network, setNetwork] = useState(null),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [searched, setSearched] = useState(false);
  const search = async (e) => {
    e.preventDefault();
    setBusy("search");
    setError("");
    try {
      setResults(await searchPlaces(query));
      setSearched(true);
    } catch (e) {
      setError(
        e.name === "TimeoutError"
          ? "Search took too long. Try another place or use the map pin."
          : e.message,
      );
    } finally {
      setBusy("");
    }
  };
  const approximate = async () => {
    setBusy("network");
    setError("");
    try {
      setNetwork(await findNetworkArea());
    } catch (e) {
      setError(
        e.message ||
          "Network lookup failed. Address search is still available.",
      );
    } finally {
      setBusy("");
    }
  };
  const confirm = (p) => {
    location.setChosen(p);
    setToast(
      p.source === "network"
        ? "Approximate area selected. It is not a live or precise location."
        : "Place confirmed. It is attached to your alert as a chosen address.",
    );
    setResults([]);
    setSearched(false);
    setNetwork(null);
  };
  return (
    <section className="card place-search-panel">
      <div className="place-search-heading">
        <span className="soft-icon">
          <Icon name="search" size={21} />
        </span>
        <div>
          <span className="eyebrow">A WORKING ALTERNATIVE TO GPS</span>
          <h2>Find your address.</h2>
        </div>
      </div>
      <p>
        Search a campus, street, or landmark. Confirm the result to put a real
        place on your map.
      </p>
      <form className="place-search-form" onSubmit={search}>
        <label className="visually-hidden" htmlFor="place-query">
          Search a place or address
        </label>
        <input
          id="place-query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. India Gate, New Delhi"
          minLength={3}
          maxLength={180}
          required
        />
        <button
          className="primary-button"
          disabled={!!busy}
          aria-label="Search places"
        >
          {busy === "search" ? (
            <span className="loading-spinner" />
          ) : (
            <Icon name="search" size={19} />
          )}
        </button>
      </form>
      <small className="place-provider-note">
        Your search is sent to the geocoding provider. Search public places
        where possible.
      </small>
      {results.length > 0 && (
        <div className="place-results" aria-label="Search results">
          {results.map((p) => (
            <button key={p.id} onClick={() => confirm(p)}>
              <Icon name="location" size={19} />
              <span>
                {p.label}
                <small>Confirm this place · Not live GPS</small>
              </span>
              <Icon name="plus" size={17} />
            </button>
          ))}
        </div>
      )}
      {searched && !results.length && !error && (
        <p className="place-empty">
          No results shown. Search another landmark or street if you haven’t
          selected one.
        </p>
      )}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      {allowNetwork && (
        <div className="network-location-option">
          <div>
            <strong>No address handy?</strong>
            <p>Estimate your city from your network, then confirm it.</p>
          </div>
          <button
            className="outline-button"
            disabled={!!busy}
            onClick={approximate}
          >
            {busy === "network" ? (
              <span className="loading-spinner" />
            ) : (
              <Icon name="wifi" size={17} />
            )}
            Find approximate area
          </button>
          <small>
            This sends your public IP to ipwho.is. VPNs and mobile networks may
            point elsewhere. This is not live tracking.
          </small>
        </div>
      )}
      {network && (
        <div className="network-result">
          <span className="pill amber">APPROXIMATE CITY ONLY</span>
          <h3>{network.label}</h3>
          <p>
            Check this is your area. For an emergency, choose a specific address
            or map pin instead of relying on this city estimate.
          </p>
          <button className="primary-button" onClick={() => confirm(network)}>
            Use this approximate area
            <Icon name="check" size={17} />
          </button>
          <button className="text-link" onClick={() => setNetwork(null)}>
            That’s not my area
          </button>
        </div>
      )}
      <div className="search-attribution">
        Place search by{" "}
        <a href="https://photon.komoot.io" target="_blank" rel="noreferrer">
          Photon
        </a>{" "}
        · Data ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
        >
          OpenStreetMap
        </a>
      </div>
    </section>
  );
}
