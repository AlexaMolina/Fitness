import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  LinearProgress,
  Grid,
} from "@mui/material";
import {
  Activity,
  Dumbbell,
  Apple,
  Battery,
  Check,
  X,
  Droplet,
  Timer,
  FootprintsIcon,
  Moon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Results = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [dailyActivity, setDailyActivity] = useState({
    workoutDuration: 0,
    waterGlasses: 0,
    caloriesBurned: 0,
    stepsCount: 0,
    sleepHours: 0,
  });

  const [fitnessData, setFitnessData] = useState({
    completedWorkouts: 0,
    totalWorkouts: 30,
    consistencyRate: 0,
    activityData: [],
  });

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const updatedActivityData = [...fitnessData.activityData];

    if (updatedActivityData.length > 6) updatedActivityData.shift();

    updatedActivityData.push({
      date: today,
      steps: dailyActivity.stepsCount,
      calories: dailyActivity.caloriesBurned,
      sleep: dailyActivity.sleepHours,
    });

    setFitnessData((prev) => ({
      ...prev,
      activityData: updatedActivityData,
      completedWorkouts:
        dailyActivity.workoutDuration >= 30
          ? prev.completedWorkouts + 1
          : prev.completedWorkouts,
      consistencyRate: (
        (prev.completedWorkouts / prev.totalWorkouts) *
        100
      ).toFixed(1),
    }));

    let weeklyActivity =
      JSON.parse(localStorage.getItem("weeklyActivity")) || [];

    const existingIndex = weeklyActivity.findIndex(
      (entry) => entry.date === today
    );

    if (existingIndex !== -1) {
      weeklyActivity[existingIndex] = {
        date: today,
        stepsCount: dailyActivity.stepsCount,
        caloriesBurned: dailyActivity.caloriesBurned,
        sleepHours: dailyActivity.sleepHours,
      };
    } else {
      weeklyActivity.push({
        date: today,
        stepsCount: dailyActivity.stepsCount,
        caloriesBurned: dailyActivity.caloriesBurned,
        sleepHours: dailyActivity.sleepHours,
      });
    }

    localStorage.setItem("weeklyActivity", JSON.stringify(weeklyActivity));
  }, [dailyActivity]);

  const handleIncrement = (field, step) => {
    setDailyActivity((prev) => {
      let newCalories = prev.caloriesBurned;

      if (field === "workoutDuration") {
        newCalories += step * 10;
      } else if (field === "stepsCount") {
        newCalories += (step / 1000) * 40;
      }

      return {
        ...prev,
        [field]: prev[field] + step,
        caloriesBurned: newCalories,
      };
    });
  };

  const handleDecrement = (field, step) => {
    setDailyActivity((prev) => {
      let newCalories = prev.caloriesBurned;

      if (field === "workoutDuration") {
        newCalories = Math.max(0, prev.caloriesBurned - step * 10);
      } else if (field === "stepsCount") {
        newCalories = Math.max(0, prev.caloriesBurned - (step / 1000) * 40);
      }

      return {
        ...prev,
        [field]: Math.max(0, prev[field] - step),
        caloriesBurned: newCalories,
      };
    });
  };

  return (
    <Box sx={{ maxWidth: "900px", margin: "auto", mt: 4, p: 2 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        {t("fitnessProgress")}
      </Typography>

      <Card sx={{ boxShadow: 3, borderRadius: 3, mb: 3 }}>
        <CardHeader
          title={t("dailyActivityLog")}
          sx={{
            background: "linear-gradient(to right, #3b82f6, #2563eb)",
            color: "white",
            py: 2,
            px: 3,
          }}
        />
        <CardContent>
          {[
            {
              id: "waterGlasses",
              label: t("waterIntake"),
              icon: <Droplet size={24} color="#3b82f6" />,
              target: 8,
              step: 1,
            },
            {
              id: "workoutDuration",
              label: t("exercise"),
              icon: <Timer size={24} color="#9333ea" />,
              target: 30,
              step: 5,
            },
            {
              id: "stepsCount",
              label: t("steps"),
              icon: <FootprintsIcon size={24} color="#10b981" />,
              target: 10000,
              step: 1000,
            },
            {
              id: "sleepHours",
              label: t("sleepHours"),
              icon: <Moon size={24} color="#6366f1" />,
              target: 8,
              step: 1,
            },
          ].map((item) => (
            <Box
              key={item.id}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                bgcolor: "#f9f9f9",
                border: "1px solid #ddd",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {item.icon}
                <Typography fontWeight="medium">{item.label}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDecrement(item.id, item.step)}
                >
                  <X size={20} />
                </Button>
                <Typography variant="h5">{dailyActivity[item.id]}</Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleIncrement(item.id, item.step)}
                >
                  <Check size={20} />
                </Button>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(dailyActivity[item.id] / item.target) * 100}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </Box>
          ))}
        </CardContent>
      </Card>

      <Grid container spacing={2} mb={3}>
        <StatCard
          title={t("completedSessions")}
          value={`${fitnessData.completedWorkouts}/${fitnessData.totalWorkouts}`}
          icon={<Activity />}
          color="blue"
        />
        <StatCard
          title={t("consistency")}
          value={`${fitnessData.consistencyRate}%`}
          icon={<Dumbbell />}
          color="purple"
        />
        <StatCard
          title={t("caloriesBurned")}
          value={dailyActivity.caloriesBurned}
          icon={<Apple />}
          color="red"
        />
        <StatCard
          title={t("progress")}
          value={`${(
            (fitnessData.completedWorkouts / fitnessData.totalWorkouts) *
            100
          ).toFixed(1)}%`}
          icon={<Battery />}
          color="green"
        />
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/WeeklyResults")}
        >
          {t("viewWeeklyResults")}
        </Button>
      </Box>

      <Card sx={{ boxShadow: 3, borderRadius: 3, mt: 4 }}>
        <CardHeader
          title={t("dailyActivityLog")}
          sx={{ background: "#9333ea", color: "white", py: 2, px: 3 }}
        />
        <CardContent sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fitnessData.activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="steps" stroke="#2563eb" />
              <Line type="monotone" dataKey="calories" stroke="#ef4444" />
              <Line type="monotone" dataKey="sleep" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <Grid item xs={6} md={3}>
    <Card sx={{ boxShadow: 3, textAlign: "center", p: 2 }}>
      <Box sx={{ color, fontSize: 40, mb: 1 }}>{icon}</Box>
      <Typography variant="body2" fontWeight="medium">
        {title}
      </Typography>
      <Typography variant="h6" fontWeight="bold">
        {value}
      </Typography>
    </Card>
  </Grid>
);

export default Results;
