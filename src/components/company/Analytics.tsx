
import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30d');

  const applicationData = [
    { name: 'Week 1', applications: 12, interviews: 4 },
    { name: 'Week 2', applications: 19, interviews: 7 },
    { name: 'Week 3', applications: 15, interviews: 5 },
    { name: 'Week 4', applications: 21, interviews: 8 },
  ];

  const sourceData = [
    { name: 'LinkedIn', value: 45 },
    { name: 'Direct', value: 28 },
    { name: 'Referral', value: 17 },
    { name: 'Other', value: 10 },
  ];

  const skillsData = [
    { name: 'JavaScript', count: 42 },
    { name: 'React', count: 35 },
    { name: 'Python', count: 28 },
    { name: 'AWS', count: 22 },
    { name: 'UI/UX', count: 18 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Analytics Dashboard</CardTitle>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-gray-500" />
          <TabsList className="bg-muted">
            <TabsTrigger 
              value="7d" 
              className={dateRange === '7d' ? 'bg-white' : ''}
              onClick={() => setDateRange('7d')}
            >
              7d
            </TabsTrigger>
            <TabsTrigger 
              value="30d" 
              className={dateRange === '30d' ? 'bg-white' : ''}
              onClick={() => setDateRange('30d')}
            >
              30d
            </TabsTrigger>
            <TabsTrigger 
              value="90d" 
              className={dateRange === '90d' ? 'bg-white' : ''}
              onClick={() => setDateRange('90d')}
            >
              90d
            </TabsTrigger>
          </TabsList>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Applications & Interviews</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={applicationData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="applications" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="interviews" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Application Sources</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Top Candidate Skills</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={skillsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Analytics;
