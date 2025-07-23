import React, { useMemo } from "react";
import Mapbox from "@rnmapbox/maps";
import { Vessel } from "../config/types";

type Props = { vessels: Vessel[]; onVesselPress?: (vessel: Vessel) => void };

const VesselAnnotations: React.FC<Props> = ({ vessels, onVesselPress }) => {
  //console.log("Vessels:", vessels);
  const geojson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: vessels.map((vessel) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [vessel.longitude, vessel.latitude],
        },
        properties: {
          id: vessel.mmsi,
          heading: vessel.trueHeading < 360 ? vessel.trueHeading : 0,
          isMoving: vessel.sog > 0,
        },
      })),
    }),
    [vessels]
  );

  const handlePress = (e: any) => {
    if (!onVesselPress) return;
    const feature = e.features[0];
    const mmsi = feature.properties.id;
    const vessel = vessels.find((v) => v.mmsi === mmsi);
    if (vessel) onVesselPress(vessel);
  };

  return (
    <Mapbox.ShapeSource id="vessels" shape={geojson} onPress={handlePress}>
      <Mapbox.SymbolLayer
        id="vessel-symbols"
        style={{
          iconImage: [
            "case",
            ["boolean", ["get", "isMoving"], false],
            "vessel-moving",
            "vessel-stationary",
          ],
          iconRotate: ["get", "heading"],
          iconAllowOverlap: true,
          iconSize: 1,
        }}
      />
    </Mapbox.ShapeSource>
  );
};

export default VesselAnnotations;
