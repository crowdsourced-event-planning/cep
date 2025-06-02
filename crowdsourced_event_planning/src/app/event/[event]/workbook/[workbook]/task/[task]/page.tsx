import { getTaskById } from "@/lib/data/task";
import { getEventBySlugOrId } from "@/lib/data/event";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface TaskPageProps {
  params: Promise<{ event: string; workbook: string; task: string }>;
}

// export async function generateMetadata({
//   params,
// }: TaskPageProps): Promise<Metadata> {
//   const {
//     event: eventParam,
//     workbook: workbookParam,
//     task: taskParam,
//   } = await params;
//   const [event, workbook, task] = await Promise.all([
//     getEventById(eventParam),
//     getWorkbookById(workbookParam),
//     getTaskById(taskParam),
//   ]);

//   if (!event || !workbook || !task) {
//     return {
//       title: "Task Not Found - Collabora",
//     };
//   }
//   return {
//     title: `${task.name} - ${workbook.name} - ${event.title} - Collabora`,
//     description: task.description,
//   };
// }

// export default async function TaskDetailPage({ params }: TaskPageProps) {
//   try {
//     const {
//       event: eventParam,
//       workbook: workbookParam,
//       task: taskParam,
//     } = await params;
//     const [event, workbook, task] = await Promise.all([
//       getEventById(eventParam),
//       getWorkbookById(workbookParam),
//       getTaskById(taskParam),
//     ]);

//     if (!event || !workbook || !task) {
//       notFound();
//     }

//     const getStatusColor = (status: string) => {
//       switch (status) {
//         case "todo":
//           return "bg-gray-100 text-gray-800";
//         case "in_progress":
//           return "bg-blue-100 text-blue-800";
//         case "review":
//           return "bg-yellow-100 text-yellow-800";
//         case "done":
//           return "bg-green-100 text-green-800";
//         default:
//           return "bg-gray-100 text-gray-800";
//       }
//     };

//     const getPriorityColor = (priority: string) => {
//       switch (priority?.toLowerCase()) {
//         case "high":
//           return "bg-red-100 text-red-800";
//         case "medium":
//           return "bg-orange-100 text-orange-800";
//         case "low":
//           return "bg-green-100 text-green-800";
//         default:
//           return "bg-gray-100 text-gray-800";
//       }
//     };

//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//           {/* Breadcrumb */}
//           <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
//             <Link href="/" className="hover:text-blue-600">
//               Home
//             </Link>
//             <span>/</span>
//             <Link href={`/event/${eventParam}`} className="hover:text-blue-600">
//               {event.title}
//             </Link>
//             <span>/</span>
//             <Link
//               href={`/event/${eventParam}/workbook/${workbookParam}`}
//               className="hover:text-blue-600"
//             >
//               {workbook.name}
//             </Link>
//             <span>/</span>
//             <span className="text-gray-900">{task.name}</span>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             {/* Main Content */}
//             <div className="lg:col-span-3 space-y-6">
//               {/* Task Header */}
//               <Card>
//                 <div className="space-y-4">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <h1 className="text-3xl font-bold text-gray-900 mb-3">
//                         {task.name}
//                       </h1>
//                       <div className="flex items-center space-x-3">
//                         <span
//                           className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                             task.status
//                           )}`}
//                         >
//                           {task.status.toUpperCase().replace("_", " ")}
//                         </span>
//                         <span
//                           className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
//                             "medium"
//                           )}`}
//                         >
//                           MEDIUM PRIORITY
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex space-x-2">
//                       <Button variant="secondary" size="sm">
//                         Edit Task
//                       </Button>
//                       <Button variant="primary" size="sm">
//                         Update Status
//                       </Button>
//                     </div>
//                   </div>{" "}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
//                     <div>
//                       <strong>Created:</strong>{" "}
//                       {formatDateTime(task.createdAt || new Date())}
//                     </div>
//                     <div>
//                       <strong>Due Date:</strong>{" "}
//                       {task.dueDate ? formatDateTime(task.dueDate) : "Not set"}
//                     </div>
//                     <div>
//                       <strong>Assignees:</strong>{" "}
//                       {task.assignedTo && task.assignedTo.length > 0
//                         ? task.assignedTo.join(", ")
//                         : "Not assigned"}
//                     </div>
//                   </div>
//                 </div>
//               </Card>

//               {/* Task Description */}
//               {task.description && (
//                 <Card>
//                   <div className="space-y-4">
//                     <h2 className="text-xl font-bold text-gray-900">
//                       Description
//                     </h2>
//                     <div className="prose max-w-none">
//                       <p className="text-gray-700 whitespace-pre-wrap">
//                         {task.description}
//                       </p>
//                     </div>
//                   </div>
//                 </Card>
//               )}

//               {/* Task Activity */}
//               <Card>
//                 <div className="space-y-4">
//                   <h2 className="text-xl font-bold text-gray-900">Activity</h2>

//                   <div className="space-y-3">
//                     <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
//                       <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                         <span className="text-white text-sm font-medium">
//                           C
//                         </span>
//                       </div>
//                       <div className="flex-1">
//                         {" "}
//                         <div className="flex items-center space-x-2">
//                           <span className="font-medium">System</span>
//                           <span className="text-gray-500 text-sm">
//                             {formatDateTime(task.createdAt || new Date())}
//                           </span>
//                         </div>
//                         <p className="text-gray-700 text-sm">
//                           Task was created
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             </div>

//             {/* Sidebar */}
//             <div className="space-y-6">
//               {/* Task Actions */}
//               <Card>
//                 <div className="space-y-3">
//                   <h3 className="text-lg font-semibold">Actions</h3>

//                   <select className="w-full p-2 border border-gray-300 rounded-md">
//                     <option value="todo">Todo</option>
//                     <option value="in_progress">In Progress</option>
//                     <option value="review">Review</option>
//                     <option value="done">Done</option>
//                   </select>

//                   <Button variant="primary" className="w-full">
//                     Update Status
//                   </Button>

//                   <Button variant="secondary" className="w-full">
//                     Edit Task
//                   </Button>

//                   <Button variant="secondary" className="w-full">
//                     Assign Users
//                   </Button>

//                   <Button variant="danger" className="w-full">
//                     Delete Task
//                   </Button>
//                 </div>
//               </Card>
//               {/* Task Details */}
//               <Card>
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Details</h3>

//                   <div className="space-y-3">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Due Date
//                       </label>
//                       <input
//                         type="date"
//                         className="w-full p-2 border border-gray-300 rounded-md"
//                         defaultValue={
//                           task.dueDate
//                             ? new Date(task.dueDate).toISOString().split("T")[0]
//                             : ""
//                         }
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Priority
//                       </label>
//                       <select className="w-full p-2 border border-gray-300 rounded-md">
//                         <option value="low">Low</option>
//                         <option value="medium" selected>
//                           Medium
//                         </option>
//                         <option value="high">High</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Assignees
//                       </label>{" "}
//                       <div className="text-sm text-gray-600">
//                         {task.assignedTo && task.assignedTo.length > 0
//                           ? task.assignedTo.join(", ")
//                           : "Not assigned"}
//                       </div>
//                     </div>
//                   </div>

//                   <Button variant="secondary" className="w-full">
//                     Save Changes
//                   </Button>
//                 </div>
//               </Card>{" "}
//               {/* Task Chat */}
//               <Card>
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Task Discussion</h3>

//                   <ChatComponent
//                     taskId={taskParam}
//                     currentUserId="user-id" // This should come from auth context
//                   />
//                 </div>
//               </Card>
//               {/* Related */}
//               <Card>
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Related</h3>

//                   <div className="space-y-2">
//                     <Link
//                       href={`/event/${eventParam}`}
//                       className="block text-blue-600 hover:underline text-sm"
//                     >
//                       ← Back to Event
//                     </Link>
//                     <Link
//                       href={`/event/${eventParam}/workbook/${workbookParam}`}
//                       className="block text-blue-600 hover:underline text-sm"
//                     >
//                       ← Back to Workbook
//                     </Link>
//                   </div>
//                 </div>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error("Error loading task:", error);
//     notFound();
//   }

interface TaskPageProps {
  params: Promise<{ event: string; workbook: string; task: string }>;
}

export default async function TaskDetail({ params }: TaskPageProps) {
  const resolvedParams = await params;
  const eventParam = resolvedParams.event;
  const workbookId = resolvedParams.workbook;
  const taskId = resolvedParams.task;

  if (!eventParam || !workbookId || !taskId) {
    return <div>ID event, workbook, atau task tidak ditemukan</div>;
  }

  const task = await getTaskById(taskId);
  if (!task) {
    return <div>Task tidak ditemukan</div>;
  }

  if (task.workbookId.toString() !== workbookId) {
    return <div>Task tidak sesuai dengan workbook ini</div>;
  }

  const db = await getDb();
  const workbook = await db
    .collection("workbooks")
    .findOne({ _id: new ObjectId(workbookId) });
  if (!workbook) {
    return <div>Workbook tidak ditemukan</div>;
  }

  // Get the event to verify the relationship
  const event = await getEventBySlugOrId(eventParam);
  if (!event) {
    return <div>Event tidak ditemukan</div>;
  }

  // Compare the actual event ID with the workbook's eventId
  const eventId = event._id?.toString();
  if (workbook.eventId.toString() !== eventId) {
    return <div>Workbook tidak sesuai dengan event ini</div>;
  }

  const assignees = await db
    .collection("users")
    // .find({ _id: { $in: task.assignedTo } })
    .find({
      _id: { $in: (task.assignedTo ?? []).map((id) => new ObjectId(id)) },
    })
    .toArray();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{task.name}</h1>
      <p className="mb-2">{task.description}</p>
      <p className="mb-2">Status: {task.status}</p>
      <p className="mb-2">
        Batas Waktu:{" "}
        {task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : "Tidak ada"}
      </p>
      <p className="mb-2">
        Ditugaskan kepada:{" "}
        {assignees.map((user) => user.name).join(", ") || "Tidak ada"}
      </p>
      {task.parentTask && (
        <p className="mb-2">Subtask dari: {task.parentTask.toString()}</p>
      )}

      {/* {task.customColumn && task.customColumn.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-6 mb-4">Kolom Kustom</h2>
          <ul className="list-disc pl-5">
            {task.customColumn.map(
              (col: { label: string; value: string }, index: number) => (
                <li key={index}>
                  {col.label}: {col.value}
                </li>
              )
            )}
          </ul>
        </>
      )} */}

      {(task.customColumn as { label: string; value: string }[]).map(
        (col, index) => (
          <li key={index}>
            {col.label}: {col.value}
          </li>
        )
      )}
    </div>
  );
}
