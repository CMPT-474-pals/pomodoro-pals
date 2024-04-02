import Layout from "../components/Layout";
import { getCurrentUser } from "@aws-amplify/auth";
import { CLOUDFRONT_URL } from "../utils/config";
import React, { useState } from "react";
import RecordForm from "../components/RecordForm";
import RecordList from "../components/RecordList";
import RecordToggler from "../components/RecortToggle";

const Record = () => {
  const [goals, setGoals] = useState<string[]>([]);
  const [completedGoals, setCompletedGoals] = useState<string[]>([]);

  // const addGoal = (text: string) => {
  // 	setGoals(prevGoals => [...prevGoals, text]);
  // };

  const addGoal = async (text: string) => {
    // Get the current user
    const user = await getCurrentUser();
    const userID = user ? user.username : null;

    // Data to be sent to the API
    const postData = {
      userID: userID,
      completed: false,
      goalName: text,
    };

    // Making a POST request using fetch
    try {
      const response = await fetch(`${CLOUDFRONT_URL}/pomodoroRecord`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);

      // Update the local state only after the record has been successfully created in the backend
      setGoals((prevGoals) => [...prevGoals, text]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const markAsComplete = (index: number) => {
    const completedGoal = goals[index];
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
    setCompletedGoals((prevCompletedGoals) => [
      completedGoal,
      ...prevCompletedGoals,
    ]);
  };

  return (
    <Layout page={"record"}>
      <div className="h-full w-full pt-20 md:pb-14">
        <div className="flex items-center justify-center pb-8 text-xl text-white">
          Pomodoro Record
        </div>

        <div className="m-auto flex w-11/12 flex-col justify-between gap-2 text-white">
          <RecordToggler
            goals={goals}
            completedGoals={completedGoals}
            markAsComplete={markAsComplete}
          />

          <RecordForm onAddGoal={addGoal} />
        </div>
      </div>
    </Layout>
  );
};

export default Record;
