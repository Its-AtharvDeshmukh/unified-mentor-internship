import { useEffect, useRef, useState } from "react";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import Icon from "./Icon";
import { useSafety } from "../context/SafetyContext";
import { accuracyPolygon } from "../lib/location";
import { locationSourceLabel } from "../lib/locationProviders";
const styles = {
  minimal: "https://tiles.openfreemap.org/styles/positron",
  street: "https://tiles.openfreemap.org/styles/liberty",
  dark: "https://tiles.openfreemap.org/styles/dark",
};
export default function MapPreview({ large = false, picking = false, onPick }) {
  const { location } = useSafety();
  const position = location.position;
  const host = useRef(null),
    map = useRef(null),
    marker = useRef(null),
    library = useRef(null),
    latest = useRef(position),
    pickRef = useRef({ picking, onPick });
  latest.current = position;
  pickRef.current = { picking, onPick };
  const [style, setStyle] = useState("minimal");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [follow, setFollow] = useState(true);
  const followRef = useRef(true);
  useEffect(() => {
    let cancelled = false,
      observer;
    import("maplibre-gl")
      .then((module) => {
        if (cancelled) return;
        const lib = module;
        library.current = lib;
        lib.setWorkerUrl(workerUrl);
        let instance;
        try {
          instance = new lib.Map({
            container: host.current,
            style: styles.minimal,
            center: [79, 22.8],
            zoom: 3.7,
            attributionControl: { compact: true },
            cooperativeGestures: true,
            fadeDuration: 150,
          });
        } catch {
          setError(
            "This browser could not start the interactive map. Try a browser with WebGL enabled. You can still enter coordinates below.",
          );
          return;
        }
        map.current = instance;
        instance.addControl(
          new lib.NavigationControl({ showCompass: false }),
          "top-left",
        );
        instance.on("load", () => {
          if (!cancelled) {
            setReady(true);
            setError("");
          }
        });
        instance.on("style.load", () => {
          if (!cancelled) setReady(true);
        });
        instance.on("error", (event) => {
          if (!cancelled && !instance.isStyleLoaded())
            setError(
              "The map could not load. Check your connection and retry.",
            );
        });
        instance.on("dragstart", () => {
          followRef.current = false;
          setFollow(false);
        });
        instance.on("click", (event) => {
          if (pickRef.current.picking)
            pickRef.current.onPick?.(event.lngLat.lat, event.lngLat.lng);
        });
        observer = new ResizeObserver(() => instance.resize());
        observer.observe(host.current);
      })
      .catch(() =>
        setError(
          "The map library could not load. Refresh this page or enter coordinates below.",
        ),
      );
    return () => {
      cancelled = true;
      observer?.disconnect();
      marker.current?.remove();
      map.current?.remove();
      map.current = null;
      marker.current = null;
    };
  }, []);
  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready) return;
    if (!position) {
      const hadMarker = !!marker.current;
      marker.current?.remove();
      marker.current = null;
      if (instance.getLayer("accuracy-fill"))
        instance.removeLayer("accuracy-fill");
      if (instance.getSource("accuracy-area"))
        instance.removeSource("accuracy-area");
      if (hadMarker) instance.jumpTo({ center: [79, 22.8], zoom: 3.7 });
      return;
    }
    const coordinates = [position.longitude, position.latitude];
    if (!marker.current) {
      const element = document.createElement("div");
      element.className = "haven-map-marker";
      element.setAttribute("role", "img");
      element.setAttribute("aria-label", locationSourceLabel(position));
      marker.current = new library.current.Marker({ element })
        .setLngLat(coordinates)
        .addTo(instance);
      followRef.current = true;
      setFollow(true);
      instance.jumpTo({
        center: coordinates,
        zoom:
          position.source === "network"
            ? 9
            : position.accuracy > 3000
              ? 11
              : 15,
      });
    } else {
      marker.current.setLngLat(coordinates);
      if (followRef.current) instance.jumpTo({ center: coordinates });
    }
    marker.current
      .getElement()
      .setAttribute("aria-label", locationSourceLabel(position));
    if (instance.isStyleLoaded()) {
      const geometry = accuracyPolygon(position);
      if (instance.getSource("accuracy-area"))
        instance.getSource("accuracy-area").setData(geometry);
      else {
        instance.addSource("accuracy-area", {
          type: "geojson",
          data: geometry,
        });
        instance.addLayer({
          id: "accuracy-fill",
          type: "fill",
          source: "accuracy-area",
          paint: { "fill-color": "#f47c59", "fill-opacity": 0.15 },
        });
      }
    }
  }, [position, ready, style]);
  useEffect(() => {
    if (map.current)
      map.current.getCanvas().style.cursor = picking ? "crosshair" : "";
  }, [picking, ready]);
  const switchStyle = (value) => {
    setStyle(value);
    setReady(false);
    setError("");
    map.current?.setStyle(styles[value]);
  };
  const recenter = () => {
    if (position) {
      map.current?.easeTo({
        center: [position.longitude, position.latitude],
        zoom: 15,
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : 500,
      });
      followRef.current = true;
      setFollow(true);
    } else
      map.current?.easeTo({ center: [79, 22.8], zoom: 3.7, duration: 400 });
  };
  return (
    <div
      className={`map-preview real-map vector-map ${large ? "large-map" : ""} ${picking ? "is-picking" : ""}`}
    >
      <div
        className="map-canvas"
        ref={host}
        role="region"
        aria-label="Interactive map. Drag to pan and use zoom controls."
      />
      <span className="map-label">
        <i className="dot" />
        {picking
          ? "Tap the map to choose a location"
          : position && position.source !== "gps"
            ? `${locationSourceLabel(position)} · Not live GPS`
            : location.status === "stale"
              ? "Last known position · Updates paused"
              : position
                ? follow
                  ? "Following your device"
                  : "Exploring map"
                : "Explore freely · Location off"}
      </span>
      <div className="map-style-switch" aria-label="Map appearance">
        {[
          ["minimal", "Minimal"],
          ["street", "Street"],
          ["dark", "Dark"],
        ].map(([value, label]) => (
          <button
            key={value}
            aria-pressed={style === value}
            onClick={() => switchStyle(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <button
        className="map-recenter"
        aria-label={
          position ? "Center map on your location" : "Reset map to India"
        }
        onClick={recenter}
      >
        <Icon name="locate" size={19} />
      </button>
      {!ready && !error && (
        <div className="map-loading">
          <span className="loading-spinner" />
          Loading your map…
        </div>
      )}
      {error && (
        <div className="map-error" role="status">
          <Icon name="warning" size={16} />
          <span>{error}</span>
          <button onClick={() => switchStyle(style)}>Retry</button>
        </div>
      )}
    </div>
  );
}
