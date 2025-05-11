import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useMemo } from 'react';
import getIcon from '../utils/iconUtils';

const MainFeature = () => {
  // State for document editor
  const [currentPage, setCurrentPage] = useState({
    id: '1',
    title: 'Untitled Document',
    content: [],
    lastEdited: new Date()
  });
  
  const [blocks, setBlocks] = useState([
    { id: '1', type: 'heading', content: 'Getting Started with ThoughtSpace', level: 1 },
    { id: '2', type: 'paragraph', content: '<p>Welcome to your new workspace. Use ThoughtSpace to organize your ideas, projects, and knowledge.</p>' },
    { id: '3', type: 'todo', content: 'Create my first page', completed: true },
    { id: '4', type: 'todo', content: 'Set up a database', completed: false },
    { id: '5', type: 'todo', content: 'Invite team members', completed: false },
    { id: '6', type: 'paragraph', content: '<p>Click on any block to edit it, or use the + button to add new blocks.</p>' },
  ]);
  
  const [activeBlock, setActiveBlock] = useState(null);
  const [newBlockContent, setNewBlockContent] = useState('');
  const [blockType, setBlockType] = useState('paragraph');
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [activeFormatting, setActiveFormatting] = useState({});
  const [showBlockTypeMenu, setShowBlockTypeMenu] = useState(false);
  
  // Icon declarations
  const PlusIcon = getIcon('Plus');
  const TypeIcon = getIcon('Type');
  const ListIcon = getIcon('List');
  const CheckSquareIcon = getIcon('CheckSquare');
  const ImageIcon = getIcon('Image');
  const CodeIcon = getIcon('Code');
  const TrashIcon = getIcon('Trash');
  const MoveIcon = getIcon('Move');
  const SaveIcon = getIcon('Save');
  const BoldIcon = getIcon('Bold');
  const ItalicIcon = getIcon('Italic');
  const UnderlineIcon = getIcon('Underline');
  const LinkIcon = getIcon('Link');
  const Heading1Icon = getIcon('Heading1');
  const Heading2Icon = getIcon('Heading2');
  const Heading3Icon = getIcon('Heading3');
  const TextIcon = getIcon('Text');
  const AlignLeftIcon = getIcon('AlignLeft');
  const AlignCenterIcon = getIcon('AlignCenter');
  const AlignRightIcon = getIcon('AlignRight');

  // Block type options
  const blockTypes = [
    { id: 'heading1', name: 'Heading 1', icon: 'Heading1', type: 'heading', level: 1 },
    { id: 'heading2', name: 'Heading 2', icon: 'Heading2', type: 'heading', level: 2 },
    { id: 'heading3', name: 'Heading 3', icon: 'Heading3', type: 'heading', level: 3 },
    { id: 'paragraph', name: 'Paragraph', icon: 'Text', type: 'paragraph' },
    { id: 'todo', name: 'To-do List', icon: 'CheckSquare', type: 'todo' },
    { id: 'bulletList', name: 'Bullet List', icon: 'List', type: 'bulletList' },
    { id: 'code', name: 'Code Block', icon: 'Code', type: 'code' },
  ];

  const handleAddBlock = () => {
    setIsAddingBlock(true);
    setNewBlockContent('');
    setBlockType('paragraph');
  };

  const saveNewBlock = () => {
    if (newBlockContent.trim()) {
      const newBlock = {
        id: Date.now().toString(),
        type: blockType,
        content: newBlockContent,
        ...(blockType === 'heading' && { level: 2 }),
        ...(blockType === 'todo' && { completed: false }),
      };
      
      setBlocks([...blocks, newBlock]);
      toast.success("Block added successfully!");
    }
    
    setIsAddingBlock(false);
    setNewBlockContent('');
  };

  const handleBlockClick = (id) => {
    setActiveBlock(id);
  };

  const updateBlockContent = (id, content) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const toggleTodoStatus = (id) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, completed: !block.completed } : block
    ));
  };

  const deleteBlock = (id) => {
    setBlocks(blocks.filter(block => block.id !== id));
    setActiveBlock(null);
    toast.info("Block deleted");
  };

  const getBlockTypeIcon = (type, level) => {
    if (type === 'heading') {
      switch(level) {
        case 1: return Heading1Icon;
        case 2: return Heading2Icon;
        case 3: return Heading3Icon;
        default: return TextIcon;
      }
    }
    
    switch(type) {
      case 'paragraph': return TextIcon;
      case 'todo': return CheckSquareIcon;
      case 'bulletList': return ListIcon;
      case 'code': return CodeIcon;
      default: return TextIcon;
    }
  };

  const changeBlockType = (id, newType, level) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, type: newType, ...(level && { level }) } : block
    ));
    setShowBlockTypeMenu(false);
  };

  const handleSave = () => {
    setCurrentPage(prev => ({
      ...prev,
      content: blocks,
      lastEdited: new Date()
    }));
    toast.success("Page saved successfully!");
  };

  // Text Editor Component
  const TextEditor = ({ content, onChange, autoFocus = false, placeholder = "Type something..." }) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right'],
        }),
      ],
      content: content,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      autofocus: autoFocus,
      editorProps: {
        attributes: {
          class: 'focus:outline-none prose dark:prose-invert prose-sm sm:prose-base max-w-none',
        },
      },
    });

    useEffect(() => {
      if (!editor) return;

      // Update formatting state
      setActiveFormatting({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        heading1: editor.isActive('heading', { level: 1 }),
        heading2: editor.isActive('heading', { level: 2 }),
        heading3: editor.isActive('heading', { level: 3 }),
        alignLeft: editor.isActive({ textAlign: 'left' }),
        alignCenter: editor.isActive({ textAlign: 'center' }),
        alignRight: editor.isActive({ textAlign: 'right' }),
      });
    }, [editor]);

    if (!editor) {
      return null;
    }

    return (
      <EditorContent editor={editor} />
    );
  };
  
  // Apply formatting for active editor
  const applyFormatting = (formatType) => {
    // Find block content containing active editor
    const blockToEdit = blocks.find(block => block.id === activeBlock);
    if (!blockToEdit) return;
    
    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = blockToEdit.content;
    
    // Handle different format types
    switch (formatType) {
      case 'bold':
        // Apply bold formatting
        break;
      case 'italic':
        // Apply italic formatting
        break;
      case 'underline':
        // Apply underline formatting
        break;
      case 'link':
        // Apply link formatting
        break;
      // Additional cases for other formatting options
    }
    
    // Update the block content with the formatted HTML
    updateBlockContent(activeBlock, tempDiv.innerHTML);
    setActiveFormatting({ ...activeFormatting, [formatType]: !activeFormatting[formatType] });
  };

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden">
      {/* Document Header */}
      <div className="p-4 md:p-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <input
            type="text"
            value={currentPage.title}
            onChange={(e) => setCurrentPage({...currentPage, title: e.target.value})}
            className="text-xl md:text-2xl font-bold bg-transparent focus:outline-none border-b-2 border-transparent focus:border-primary flex-grow"
            placeholder="Untitled Document"
          />
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsToolbarOpen(!isToolbarOpen)}
              className="btn btn-secondary text-sm hidden md:flex items-center gap-1"
            >
              <TypeIcon className="w-4 h-4" />
              <span>Formatting</span>
            </button>
            
            <button 
              onClick={handleSave}
              className="btn btn-primary text-sm flex items-center gap-1"
            >
              <SaveIcon className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
        
        {/* Formatting Toolbar - Desktop */}
        <AnimatePresence>
          {isToolbarOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden md:flex items-center gap-2 mt-2 overflow-hidden"
            >
              <div className="bg-surface-100 dark:bg-surface-700 rounded-lg p-1 flex items-center gap-1">
                <button onClick={() => applyFormatting('bold')} className={`p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-600 ${activeFormatting.bold ? 'bg-primary/20' : ''}`}>
                  <BoldIcon className="w-4 h-4" />
                </button>
                <button onClick={() => applyFormatting('italic')} className={`p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-600 ${activeFormatting.italic ? 'bg-primary/20' : ''}`}>
                  <ItalicIcon className="w-4 h-4" />
                </button>
                <button onClick={() => applyFormatting('underline')} className={`p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-600 ${activeFormatting.underline ? 'bg-primary/20' : ''}`}>
                  <UnderlineIcon className="w-4 h-4" />
                </button>
                <button onClick={() => applyFormatting('link')} className={`p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-600 ${activeFormatting.link ? 'bg-primary/20' : ''}`}>
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="bg-surface-100 dark:bg-surface-700 rounded-lg p-1 flex items-center gap-1">
                <button onClick={() => applyFormatting('alignLeft')} className={`p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-600 ${activeFormatting.alignLeft ? 'bg-primary/20' : ''}`}>
                  <AlignLeftIcon className="w-4 h-4" />
                </button>
                <button onClick={() => applyFormatting('alignCenter')} className={`p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-600 ${activeFormatting.alignCenter ? 'bg-primary/20' : ''}`}>
                  <AlignCenterIcon className="w-4 h-4" />
                </button>
                <button onClick={() => applyFormatting('alignRight')} className={`p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-600 ${activeFormatting.alignRight ? 'bg-primary/20' : ''}`}>
                  <AlignRightIcon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="bg-surface-100 dark:bg-surface-700 rounded-lg p-1 flex items-center gap-1">
                <button onClick={() => applyFormatting('heading1')} className={`p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-600 ${activeFormatting.heading1 ? 'bg-primary/20' : ''}`}>
                  <Heading1Icon className="w-4 h-4" />
                </button>
                <button onClick={() => applyFormatting('heading2')} className={`p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-600 ${activeFormatting.heading2 ? 'bg-primary/20' : ''}`}>
                  <Heading2Icon className="w-4 h-4" />
                </button>
                <button onClick={() => applyFormatting('heading3')} className={`p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-600 ${activeFormatting.heading3 ? 'bg-primary/20' : ''}`}>
                  <Heading3Icon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Formatting Toolbar - Mobile */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto py-2 scrollbar-hide">
          <button className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700">
            <BoldIcon className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700">
            <ItalicIcon className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700">
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700">
            <Heading1Icon className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700">
            <Heading2Icon className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700">
            <Heading3Icon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Document Body */}
      <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
        {blocks.map((block) => {
          const BlockTypeIcon = getBlockTypeIcon(block.type, block.level);
          
          return (
            <div 
              key={block.id} 
              className={`group relative mb-4 p-2 rounded-lg ${activeBlock === block.id ? 'bg-surface-100 dark:bg-surface-800/60' : 'hover:bg-surface-50 dark:hover:bg-surface-800/30'}`}
              onClick={() => handleBlockClick(block.id)}
            >
              {/* Block Menu - Shows when block is active */}
              {activeBlock === block.id && (
                <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-1">
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBlockTypeMenu(!showBlockTypeMenu);
                      }}
                      className="p-1.5 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600"
                    >
                      <BlockTypeIcon className="w-4 h-4" />
                    </button>
                    
                    {/* Block Type Menu */}
                    {showBlockTypeMenu && (
                      <div className="absolute left-full ml-2 top-0 bg-white dark:bg-surface-800 shadow-card rounded-lg p-2 w-40 z-10">
                        {blockTypes.map(type => {
                          const TypeOptionIcon = getIcon(type.icon);
                          return (
                            <button 
                              key={type.id}
                              className="flex items-center gap-2 w-full p-2 text-left text-sm hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                changeBlockType(block.id, type.type, type.level);
                              }}
                            >
                              <TypeOptionIcon className="w-4 h-4" />
                              <span>{type.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBlock(block.id);
                    }}
                    className="p-1.5 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-red-100 dark:hover:bg-red-900/50 text-surface-600 dark:text-surface-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  
                  <button className="p-1.5 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 cursor-move">
                    <MoveIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {/* Block Content */}
              {block.type === 'heading' && (
                <div 
                  className={
                    block.level === 1 ? 'text-2xl md:text-3xl font-bold' : 
                    block.level === 2 ? 'text-xl md:text-2xl font-bold' : 
                    'text-lg md:text-xl font-semibold'
                  }
                >
                  {activeBlock === block.id ? (
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => updateBlockContent(block.id, e.target.value)}
                      className="w-full bg-transparent focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <div>{block.content}</div>
                  )}
                </div>
              )}
              
              {block.type === 'paragraph' && (
                <div>
                  {activeBlock === block.id ? (
                    <TextEditor
                      content={block.content}
                      onChange={(html) => updateBlockContent(block.id, html)}
                      autoFocus
                    />
                  ) : (
                    <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: block.content }}></div>
                  )}
                </div>
              )}
              
              {block.type === 'todo' && (
                <div className="flex items-start gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTodoStatus(block.id);
                    }}
                    className={`mt-1 flex-shrink-0 h-5 w-5 rounded border ${
                      block.completed 
                        ? 'bg-primary border-primary text-white flex items-center justify-center' 
                        : 'border-surface-300 dark:border-surface-600'
                    }`}
                  >
                    {block.completed && <CheckSquareIcon className="w-4 h-4" />}
                  </button>
                  
                  {activeBlock === block.id ? (
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => updateBlockContent(block.id, e.target.value)}
                      className={`flex-grow bg-transparent focus:outline-none ${
                        block.completed ? 'text-surface-400 line-through' : ''
                      }`}
                      autoFocus
                    />
                  ) : (
                    <div className={`${block.completed ? 'text-surface-400 line-through' : ''}`}>
                      {block.content}
                    </div>
                  )}
                </div>
              )}
              
              {block.type === 'bulletList' && (
                <div className="flex items-start gap-2">
                  <div className="mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-current"></div>
                  
                  {activeBlock === block.id ? (
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => updateBlockContent(block.id, e.target.value)}
                      className="flex-grow bg-transparent focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <div>{block.content}</div>
                  )}
                </div>
              )}
              
              {block.type === 'code' && (
                <div className="rounded-lg bg-surface-800 dark:bg-surface-900 text-surface-100 p-4 font-mono text-sm overflow-x-auto">
                  {activeBlock === block.id ? (
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlockContent(block.id, e.target.value)}
                      className="w-full bg-transparent focus:outline-none resize-none text-surface-100"
                      rows={Math.max(2, block.content.split('\n').length)}
                      autoFocus
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap">{block.content}</pre>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Add New Block UI */}
        {isAddingBlock ? (
          <div className="mb-4 p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-sm font-medium">Add new block</div>
              <div className="flex-grow"></div>
              <button 
                onClick={() => setIsAddingBlock(false)}
                className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
              >
                Cancel
              </button>
            </div>
            
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
              {blockTypes.map(type => {
                const BlockTypeSelectIcon = getIcon(type.icon);
                return (
                  <button 
                    key={type.id}
                    onClick={() => setBlockType(type.type)}
                    className={`flex flex-col items-center p-2 rounded-lg ${
                      blockType === type.type ? 'bg-primary/10 text-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                    }`}
                  >
                    <BlockTypeSelectIcon className="w-5 h-5 mb-1" />
                    <span className="text-xs">{type.name}</span>
                  </button>
                );
              })}
            </div>
            
            <textarea
              value={blockType === 'paragraph' ? newBlockContent.replace(/<[^>]*>/g, '') : newBlockContent}
              onChange={(e) => setNewBlockContent(e.target.value)}
              placeholder={`Type your ${blockType} content here...`}
              className="w-full p-3 rounded-lg border border-surface-200 dark:border-surface-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-800"
              rows={3}
              autoFocus
            />
            
            <div className="flex justify-end mt-3">
              <button 
                onClick={saveNewBlock}
                className="btn btn-primary"
                disabled={!newBlockContent.trim() && blockType !== 'paragraph'}
              >
                {blockType === 'paragraph' ? (
                  <span onClick={() => {
                    // For paragraph blocks, wrap content in paragraph tags if not already formatted
                    if (!newBlockContent.includes('<p>')) {
                      setNewBlockContent(`<p>${newBlockContent}</p>`);
                    }
                    saveNewBlock();
                  }}>Add Block</span>
                ) : "Add Block"}
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleAddBlock}
            className="w-full p-2 border border-dashed border-surface-300 dark:border-surface-600 rounded-lg text-surface-500 hover:text-primary hover:border-primary flex items-center justify-center gap-2 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add a block</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MainFeature;