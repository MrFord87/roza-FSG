import { useState } from 'react'; import { Button } from '@/components/ui/button'; import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; import { Card, CardContent } from '@/components/ui/card';

export default function Dashboard() { const [activeTab, setActiveTab] = useState('overview');

return ( <div className="min-h-screen bg-black text-white"> <header className="bg-gradient-to-r from-yellow-900 to-black py-6 px-8 shadow-md"> <h1 className="text-3xl font-bold tracking-wide text-yellow-400">ROZA Hub</h1> <p className="text-sm text-yellow-200">Your central command center for contracts</p> </header>

<main className="p-8">
    <Tabs defaultValue="overview" onValueChange={setActiveTab}>
      <TabsList className="flex space-x-4 mb-6 border-b border-yellow-800">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
        <TabsTrigger value="proposals">Proposals</TabsTrigger>
        <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card className="bg-yellow-950 border border-yellow-700 mb-4">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold text-yellow-300 mb-2">Mission Control</h2>
            <p className="text-yellow-100">Track tasks, deadlines, and ownership all in one place.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="calendar">
        <Card className="bg-yellow-950 border border-yellow-700 mb-4">
          <CardContent className="p-4">Calendar view goes here.</CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contacts">
        <Card className="bg-yellow-950 border border-yellow-700 mb-4">
          <CardContent className="p-4">List of your key contacts (e.g., Antoine, Anthony, Ubaldo).</CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="proposals">
        <Card className="bg-yellow-950 border border-yellow-700 mb-4">
          <CardContent className="p-4">Proposal drafts, templates, and assignments.</CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="knowledge">
        <Card className="bg-yellow-950 border border-yellow-700 mb-4">
          <CardContent className="p-4">FAQ, RFP vs RFQ, glossary of terms.</CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="bookmarks">
        <Card className="bg-yellow-950 border border-yellow-700 mb-4">
          <CardContent className="p-4">Links to SAM.gov, FPDS, SBA, and more.</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </main>
</div>

); 
}

