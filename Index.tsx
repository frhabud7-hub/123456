import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { ConversationsView } from "@/components/dashboard/ConversationsView";
import { KnowledgeView } from "@/components/dashboard/KnowledgeView";
import { AISettingsView } from "@/components/dashboard/AISettingsView";
import { SettingsView } from "@/components/dashboard/SettingsView";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [automationEnabled, setAutomationEnabled] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "conversations":
        return <ConversationsView />;
      case "knowledge":
        return <KnowledgeView />;
      case "ai-settings":
        return <AISettingsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        automationEnabled={automationEnabled}
        onAutomationToggle={setAutomationEnabled}
      />
      <main className="mr-64 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
