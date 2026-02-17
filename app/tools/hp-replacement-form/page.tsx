"use client";
import ToolsNavigation from "../../components/ToolsNavigation";

import { useState } from "react";
import ToolsMenu from "../../components/ToolsMenu";

export default function HpReplacementFormPage() {
  const [formData, setFormData] = useState({
    accman: "",
    siteId: "",
    parent: "",
    parentName: "",
    child: "",
    playerId: "",
    model: "",
    address: "",
    note: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const detectModel = (serial: string) => {
    if (serial.length >= 2) {
      const lastTwo = serial.slice(-2);
      switch (lastTwo) {
        case "80":
          return "Compact";
        case "57":
          return "KL4-T (Tablet)";
        case "45":
        case "48":
          return "NUC+ A";
        case "46":
          return "NUC+ V";
        case "72":
          return "NUC+ M";
        case "40":
          return "A-2U / M-2U";
        case "41":
        case "60":
          return "Dante 6 / Dante 16 / Dante 1U";
        default:
          return "";
      }
    }
    return "";
  };

  const handlePlayerIdChange = (value: string) => {
    const detectedModel = detectModel(value);
    setFormData((prev) => ({
      ...prev,
      playerId: value,
      model: detectedModel || prev.model,
    }));
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateTable = () => {
    setShowResult(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const copyTable = async () => {
    const tableContent = document.getElementById("tableContent");
    if (!tableContent) return;

    try {
      const range = document.createRange();
      range.selectNode(tableContent);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        selection.removeAllRanges();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Unable to copy table.");
    }
  };

  const tableData = [
    { label: "AccMan", value: formData.accman },
    { label: "Site ID", value: formData.siteId },
    { label: "Parent Entity", value: formData.parent },
    { label: "Parent Entity Name", value: formData.parentName },
    { label: "Child Entities", value: formData.child },
    { label: "Serial Number", value: formData.playerId },
    { label: "Player Model", value: formData.model },
    { label: "Delivery Address", value: formData.address },
    { label: "Note", value: formData.note },
  ].filter((item) => item.value.trim() !== "");

  return (
    <div className="flex min-h-screen bg-[#faf8f3] paper-texture">
      <ToolsMenu currentToolId="hp-replacement-form" />
      <ToolsNavigation currentToolId="hp-replacement-form" />

      <main className="flex-1 p-4 sm:p-6 lg:p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          {/* Form Container */}
          <div className="cozy-card p-4 sm:p-6 lg:p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#3d2914] text-center mb-4 sm:mb-6">
              Replacement Request Form
            </h2>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-[150px_1fr] items-center">
                <label className="text-sm font-medium text-[#3d2914]">AccMan</label>
                <input
                  type="text"
                  value={formData.accman}
                  onChange={(e) => handleChange("accman", e.target.value)}
                  placeholder="Account Manager Name"
                  className="w-full sketch-input px-3 py-2 text-[#3d2914]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[150px_1fr] items-center">
                <label className="text-sm font-medium text-[#3d2914]">Site ID</label>
                <input
                  type="text"
                  value={formData.siteId}
                  onChange={(e) => handleChange("siteId", e.target.value)}
                  placeholder="e.g. 21040"
                  className="w-full sketch-input px-3 py-2 text-[#3d2914]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[150px_1fr] items-center">
                <label className="text-sm font-medium text-[#3d2914]">Parent Entity</label>
                <input
                  type="text"
                  value={formData.parent}
                  onChange={(e) => handleChange("parent", e.target.value)}
                  placeholder="e.g. 21041 - Store"
                  className="w-full sketch-input px-3 py-2 text-[#3d2914]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[150px_1fr] items-center">
                <label className="text-sm font-medium text-[#3d2914]">
                  Parent Entity Name
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => handleChange("parentName", e.target.value)}
                  placeholder="e.g. Penhaligons UAE"
                  className="w-full sketch-input px-3 py-2 text-[#3d2914]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[150px_1fr] items-start">
                <label className="text-sm font-medium text-[#3d2914] pt-2">Child Entities</label>
                <textarea
                  value={formData.child}
                  onChange={(e) => handleChange("child", e.target.value)}
                  placeholder="Enter child entities..."
                  rows={3}
                  className="w-full sketch-input px-3 py-2 text-[#3d2914]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[150px_1fr] items-center">
                <label className="text-sm font-medium text-[#3d2914]">Serial Number</label>
                <input
                  type="text"
                  value={formData.playerId}
                  onChange={(e) => handlePlayerIdChange(e.target.value)}
                  placeholder="e.g. K2469240"
                  className="w-full sketch-input px-3 py-2 text-[#3d2914]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[150px_1fr] items-center">
                <label className="text-sm font-medium text-[#3d2914]">Player Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  placeholder="Auto-filled from Serial"
                  className="w-full sketch-input px-3 py-2 text-[#3d2914]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[150px_1fr] items-start">
                <label className="text-sm font-medium text-[#3d2914] pt-2">Delivery Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  rows={3}
                  className="w-full sketch-input px-3 py-2 text-[#3d2914]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[150px_1fr] items-start">
                <label className="text-sm font-medium text-[#3d2914] pt-2">Note</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => handleChange("note", e.target.value)}
                  rows={3}
                  className="w-full sketch-input px-3 py-2 text-[#3d2914]"
                />
              </div>
            </div>

            <button
              onClick={generateTable}
              className="w-full mt-6 sketch-button px-8 py-3 text-[#3d2914] font-semibold"
            >
              Generate Result Table
            </button>
          </div>

          {/* Result Container */}
          {showResult && tableData.length > 0 && (
            <div id="result-container" className="mt-10">
              <div id="tableContent" className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-[#333] text-center mb-4 pb-3 border-b-2 border-[#333]">
                  System Replacement Required
                </h3>
                <table className="w-full border-collapse">
                  <tbody>
                    {tableData.map((item, index) => (
                      <tr key={index} className="border border-[#ccc]">
                        <th className="w-[35%] bg-[#f4f4f4] border border-[#ccc] p-3 text-left font-bold text-[#333]">
                          {item.label}
                        </th>
                        <td className="border border-[#ccc] p-3 text-left text-[#333] whitespace-pre-wrap">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={copyTable}
                className={`mt-4 float-right px-5 py-2 font-bold rounded transition ${
                  copied ? "bg-[#155724]" : "bg-[#28a745] hover:bg-[#218838]"
                } text-white`}
              >
                {copied ? "Copied!" : "Copy Table for Email"}
              </button>
              <div className="clear-both"></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
