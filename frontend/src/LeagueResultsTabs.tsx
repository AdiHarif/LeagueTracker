import React, { useState } from "react";
import { Tabs } from "@skeletonlabs/skeleton-react";
import LeaguePlayersTable from "./LeaguePlayersTable";
import LeagueResultsMatrix from "./LeagueResultsMatrix";

const LeagueResultsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("standings");

  return (
    <div className="w-full mx-auto mt-8">
      <Tabs value={activeTab} onValueChange={(details) => setActiveTab(details.value)}>
        <div className="flex w-full">
          <Tabs.List className="flex w-full">
            <Tabs.Trigger className="flex-1" value="standings">Standings</Tabs.Trigger>
            <Tabs.Trigger className="flex-1" value="other">Other View</Tabs.Trigger>
          </Tabs.List>
        </div>
        <Tabs.Content value="standings">
          <div className="w-full overflow-x-auto">
            <LeaguePlayersTable />
          </div>
        </Tabs.Content>
        <Tabs.Content value="other">
          <div className="w-full overflow-x-auto">
            <LeagueResultsMatrix />
          </div>
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export default LeagueResultsTabs;
