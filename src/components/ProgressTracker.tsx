import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Circle,
  Plus,
  Calendar,
  Clock,
  Trash2,
  FileText,
  Sparkles,
  Trophy,
  Filter,
  Check,
  ChevronDown,
  BookMarked,
  MessageSquareCode,
} from "lucide-react";
import { SavedProject, MilestoneTask, LogbookEntry } from "../types";
import { calculateProjectProgress } from "../utils/storage";

interface ProgressTrackerProps {
  project: SavedProject;
  onUpdateProject: (updated: SavedProject) => void;
  onConsultAdvisor: (query: string) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  project,
  onUpdateProject,
  onConsultAdvisor,
}) => {
  const [filterPhase, setFilterPhase] = useState<number | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddLogModal, setShowAddLogModal] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPhase, setNewTaskPhase] = useState<number>(1);
  const [newTaskCategory, setNewTaskCategory] = useState("Development");
  const [newTaskDays, setNewTaskDays] = useState<number>(3);
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [newTaskDeliverable, setNewTaskDeliverable] = useState("");

  // New log form state
  const [newLogTitle, setNewLogTitle] = useState("");
  const [newLogSummary, setNewLogSummary] = useState("");
  const [newLogAdvisorFeedback, setNewLogAdvisorFeedback] = useState("");
  const [newLogNextSteps, setNewLogNextSteps] = useState("");

  const tasks = project.tasks || [];
  const logbook = project.logbook || [];
  const progress = calculateProjectProgress(project);

  const toggleTaskCompleted = (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const nextState = !task.completed;
        if (nextState) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
            });
          } catch (e) {
            // ignore if confetti fails
          }
        }
        return {
          ...task,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
      }
      return task;
    });

    const updatedProject: SavedProject = {
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updatedProject);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: MilestoneTask = {
      id: `custom-task-${Date.now()}`,
      phaseNumber: Number(newTaskPhase),
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || "Custom task added by student.",
      category: newTaskCategory,
      estimatedDays: Number(newTaskDays) || 1,
      priority: newTaskPriority,
      deliverable: newTaskDeliverable.trim() || "Milestone verification",
      completed: false,
    };

    const updatedProject: SavedProject = {
      ...project,
      tasks: [...tasks, newTask],
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
    setShowAddTaskModal(false);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDeliverable("");
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    onUpdateProject({
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddLogbookEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogTitle.trim()) return;

    const newEntry: LogbookEntry = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      title: newLogTitle.trim(),
      summary: newLogSummary.trim(),
      advisorFeedback: newLogAdvisorFeedback.trim(),
      nextSteps: newLogNextSteps.trim(),
    };

    const updatedProject: SavedProject = {
      ...project,
      logbook: [newEntry, ...logbook],
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
    setShowAddLogModal(false);
    setNewLogTitle("");
    setNewLogSummary("");
    setNewLogAdvisorFeedback("");
    setNewLogNextSteps("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterPhase !== "all" && task.phaseNumber !== filterPhase) return false;
    if (filterStatus === "completed" && !task.completed) return false;
    if (filterStatus === "pending" && task.completed) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Overview Metric Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Automated Capstone Management
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Project Milestones & Weekly Advisor Logbook
            </h1>
            <p className="text-xs text-slate-700 mt-0.5">
              Track deliverables across the 6 semester phases and log weekly progress for university review panels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Custom Milestone</span>
            </button>

            <button
              onClick={() => setShowAddLogModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
            >
              <FileText className="h-4 w-4 text-slate-600" />
              <span>Log Advisor Meeting</span>
            </button>
          </div>
        </div>

        {/* Progress Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">Overall Completion</span>
              <span className="text-sm font-bold text-indigo-600">{progress.percentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-700 block">Milestones Completed</span>
              <span className="text-lg font-bold text-slate-900">
                {progress.completed} <span className="text-xs text-slate-700 font-normal">/ {progress.total} tasks</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-700 block">Weekly Guide Reviews</span>
              <span className="text-lg font-bold text-slate-900">{logbook.length} entries</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
              <BookMarked className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Task Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Filter Tasks:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Phase filter */}
            <select
              value={filterPhase}
              aria-label="Filter by Phase"
              onChange={(e) => setFilterPhase(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 font-medium"
            >
              <option value="all">All Phases (1-6)</option>
              <option value="1">Phase 1: Requirements & Survey</option>
              <option value="2">Phase 2: Architecture & Specs</option>
              <option value="3">Phase 3: Core MVP</option>
              <option value="4">Phase 4: Advanced Features</option>
              <option value="5">Phase 5: Evaluation & Testing</option>
              <option value="6">Phase 6: Thesis & Viva</option>
            </select>

            {/* Status filter */}
            <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  filterStatus === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                onClick={() => setFilterStatus("pending")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  filterStatus === "pending" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                }`}
              >
                Pending ({tasks.filter((t) => !t.completed).length})
              </button>
              <button
                onClick={() => setFilterStatus("completed")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  filterStatus === "completed" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                }`}
              >
                Done ({tasks.filter((t) => t.completed).length})
              </button>
            </div>
          </div>
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-700 text-xs">
            No milestones match the selected filter. Add a custom task or reset filters.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  task.completed
                    ? "bg-slate-50/60 border-slate-200 text-slate-500"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs text-slate-800"
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTaskCompleted(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 transition shrink-0"
                    title={task.completed ? "Mark as pending" : "Mark as completed"}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5 hover:text-indigo-600" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-bold tracking-tight ${
                          task.completed ? "line-through text-slate-400" : "text-slate-900"
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        Phase {task.phaseNumber}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {task.category}
                      </span>
                      {task.priority && (
                        <span
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
                            task.priority === "High"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">{task.description}</p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-700 pt-0.5">
                      <span className="flex items-center gap-1 font-medium text-indigo-700">
                        <strong>Deliverable:</strong> {task.deliverable}
                      </span>
                      <span>•</span>
                      <span>~{task.estimatedDays} days</span>
                      {task.completedAt && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">
                            Completed on {new Date(task.completedAt).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition shrink-0"
                  title="Remove milestone"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logbook / Meeting Entries Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Weekly Guide / Advisor Meeting Logbook</h2>
            <p className="text-xs text-slate-700">
              Document meetings and feedback to fulfill academic audit and continuous internal evaluation requirements.
            </p>
          </div>
          <button
            onClick={() => setShowAddLogModal(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Log</span>
          </button>
        </div>

        {logbook.length === 0 ? (
          <div className="p-6 text-center text-slate-700 text-xs bg-slate-50 rounded-xl">
            No meeting notes recorded yet. Click "New Log" after your weekly project review with your college guide.
          </div>
        ) : (
          <div className="space-y-3">
            {logbook.map((log) => (
              <div key={log.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">{log.title}</h3>
                  <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{log.date}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-700">
                  <strong className="text-slate-800">Progress Presented: </strong>
                  {log.summary}
                </p>

                {log.advisorFeedback && (
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-xs text-amber-900">
                    <strong>Advisor / Guide Feedback: </strong>
                    {log.advisorFeedback}
                  </div>
                )}

                {log.nextSteps && (
                  <p className="text-xs text-slate-700">
                    <strong className="text-slate-800">Action Items For Next Week: </strong>
                    {log.nextSteps}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Project Milestone</h3>
              <button onClick={() => setShowAddTaskModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement JWT Authentication & Role-Based Access"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Phase</label>
                  <select
                    value={newTaskPhase}
                    onChange={(e) => setNewTaskPhase(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800"
                  >
                    <option value={1}>Phase 1: Requirements & Survey</option>
                    <option value={2}>Phase 2: Architecture & Specs</option>
                    <option value={3}>Phase 3: Core MVP</option>
                    <option value={4}>Phase 4: Advanced Features</option>
                    <option value={5}>Phase 5: Evaluation & Testing</option>
                    <option value={6}>Phase 6: Thesis & Viva</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Category</label>
                  <input
                    type="text"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Expected Deliverable</label>
                <input
                  type="text"
                  placeholder="e.g. Working API route + unit tests"
                  value={newTaskDeliverable}
                  onChange={(e) => setNewTaskDeliverable(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Est. Days</label>
                  <input
                    type="number"
                    min={1}
                    value={newTaskDays}
                    onChange={(e) => setNewTaskDays(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Logbook Modal */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Record Guide Meeting Log</h3>
              <button onClick={() => setShowAddLogModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLogbookEntry} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Meeting Agenda / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Review of Data Pipeline & Model Loss Curve"
                  value={newLogTitle}
                  onChange={(e) => setNewLogTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">What did you show / present?</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Demonstrated the working API and dataset de-identification..."
                  value={newLogSummary}
                  onChange={(e) => setNewLogSummary(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Guide Feedback & Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Advisor recommended adding SHAP values for feature importance..."
                  value={newLogAdvisorFeedback}
                  onChange={(e) => setNewLogAdvisorFeedback(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Action Items For Next Review</label>
                <input
                  type="text"
                  placeholder="e.g. Run benchmark evaluation on 500 test images"
                  value={newLogNextSteps}
                  onChange={(e) => setNewLogNextSteps(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
