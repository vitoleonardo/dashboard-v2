import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DASHBOARD_PATH = path.join(process.env.HOME || '', '.openclaw/workspace/DASHBOARD.md');

type TaskPriority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  text: string;
  column: 'backlog' | 'current' | 'done';
  priority?: TaskPriority;
  description?: string;
  createdAt?: string;
  dueDate?: string;
}

function parseMarkdown(content: string): Task[] {
  const tasks: Task[] = [];
  let currentColumn: 'backlog' | 'current' | 'done' | null = null;
  
  const lines = content.split('\n');
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Detect sections
    if (line.includes('## 📋 Backlog')) {
      currentColumn = 'backlog';
    } else if (line.includes('## 🔄 Current') || line.includes('## 🔄 In Progress')) {
      currentColumn = 'current';
    } else if (line.includes('## ✅ Done') || line.includes('## ✅ Completed')) {
      currentColumn = 'done';
    } else if (line.startsWith('## ') || line.startsWith('---')) {
      currentColumn = null;
    }
    
    // Parse tasks with metadata
    if (currentColumn && (line.trim().startsWith('- [ ]') || line.trim().startsWith('- [x]'))) {
      const taskText = line.trim().replace(/^- \[[x ]\] /, '').trim();
      
      // Try to extract metadata from the next line if it exists
      let priority: TaskPriority | undefined;
      let description: string | undefined;
      let dueDate: string | undefined;
      
      // Check if next line has metadata (indented with 2+ spaces or tabs)
      if (i + 1 < lines.length && (lines[i + 1].startsWith('  ') || lines[i + 1].startsWith('\t'))) {
        const metaLine = lines[i + 1].trim();
        
        // Extract priority
        if (metaLine.includes('🔴') || metaLine.includes('High')) priority = 'high';
        else if (metaLine.includes('🟡') || metaLine.includes('Medium')) priority = 'medium';
        else if (metaLine.includes('🟢') || metaLine.includes('Low')) priority = 'low';
        
        // Extract due date
        const dueDateMatch = metaLine.match(/📅 (\d{4}-\d{2}-\d{2})/);
        if (dueDateMatch) dueDate = dueDateMatch[1];
        
        // Check for description on subsequent lines
        let j = i + 2;
        const descLines: string[] = [];
        while (j < lines.length && (lines[j].startsWith('    ') || lines[j].startsWith('\t\t'))) {
          descLines.push(lines[j].trim());
          j++;
        }
        if (descLines.length > 0) {
          description = descLines.join(' ');
        }
      }
      
      if (taskText) {
        tasks.push({
          id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
          text: taskText,
          column: currentColumn,
          priority,
          description,
          dueDate,
        });
      }
    }
    
    i++;
  }
  
  return tasks;
}

function generateMarkdown(tasks: Task[]): string {
  const backlog = tasks.filter(t => t.column === 'backlog');
  const current = tasks.filter(t => t.column === 'current');
  const done = tasks.filter(t => t.column === 'done');
  
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
  
  let md = `# 🐾 Claw's Task Dashboard\n\nLast updated: ${timestamp}\n\n---\n\n`;
  
  const renderTasks = (taskList: Task[]) => {
    let output = '';
    taskList.forEach(task => {
      const checkbox = task.column === 'done' ? '[x]' : '[ ]';
      output += `- ${checkbox} ${task.text}\n`;
      
      // Add metadata if present
      if (task.priority || task.dueDate) {
        const parts: string[] = [];
        if (task.priority === 'high') parts.push('🔴 High');
        else if (task.priority === 'medium') parts.push('🟡 Medium');
        else if (task.priority === 'low') parts.push('🟢 Low');
        
        if (task.dueDate) {
          const date = new Date(task.dueDate);
          parts.push(`📅 ${date.toISOString().split('T')[0]}`);
        }
        
        if (parts.length > 0) {
          output += `  ${parts.join(' • ')}\n`;
        }
      }
      
      // Add description if present
      if (task.description) {
        output += `    ${task.description}\n`;
      }
    });
    return output;
  };
  
  md += `## 📋 Backlog\n\n`;
  md += renderTasks(backlog) || '_(No tasks)_\n';
  
  md += `\n---\n\n## 🔄 In Progress\n\n`;
  md += renderTasks(current) || '_(No tasks)_\n';
  
  md += `\n---\n\n## ✅ Completed\n\n`;
  md += renderTasks(done) || '_(No tasks)_\n';
  
  md += `\n---\n\n_This dashboard is updated as I work. Check it anytime to see what I'm doing!_\n`;
  
  return md;
}

export async function GET() {
  try {
    const content = await fs.readFile(DASHBOARD_PATH, 'utf-8');
    const tasks = parseMarkdown(content);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error reading dashboard:', error);
    return NextResponse.json({ error: 'Failed to read dashboard' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { tasks } = await request.json() as { tasks: Task[] };
    const markdown = generateMarkdown(tasks);
    await fs.writeFile(DASHBOARD_PATH, markdown, 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing dashboard:', error);
    return NextResponse.json({ error: 'Failed to write dashboard' }, { status: 500 });
  }
}
