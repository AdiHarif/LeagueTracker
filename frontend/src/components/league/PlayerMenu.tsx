import React from "react";
import { Menu, Portal } from "@skeletonlabs/skeleton-react";
import { Menu as MenuIcon, ExternalLink } from "lucide-react";

interface PlayerMenuProps {
  cardPoolUrl?: string | null;
}

const PlayerMenu: React.FC<PlayerMenuProps> = ({ cardPoolUrl }) => {
  if (!cardPoolUrl) return null;

  return (
    <Menu positioning={{ flip: true }}>
      <Menu.Trigger
        className="p-1 rounded hover:preset-tonal-primary transition-colors outline-none"
        title="Player options"
      >
        <MenuIcon size={16} />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner style={{ zIndex: 100 }}>
          <Menu.Content className="border border-surface-300-700 rounded-lg outline-none">
            <Menu.Item
              value="card-pool"
              onClick={() => window.open(cardPoolUrl, "_blank", "noopener,noreferrer")}
              className="flex items-center"
            >
              <ExternalLink size={14} />
              View Card Pool
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu>
  );
};

export default PlayerMenu;
