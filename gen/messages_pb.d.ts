// package: christiangeorgelucas.gitlab_ci_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class Pipeline extends jspb.Message {
  getYaml(): string;
  setYaml(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Pipeline.AsObject;
  static toObject(includeInstance: boolean, msg: Pipeline): Pipeline.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Pipeline, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Pipeline;
  static deserializeBinaryFromReader(message: Pipeline, reader: jspb.BinaryReader): Pipeline;
}

export namespace Pipeline {
  export type AsObject = {
    yaml: string,
  }
}

export class JobRequest extends jspb.Message {
  getYaml(): string;
  setYaml(value: string): void;

  getJobId(): string;
  setJobId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobRequest.AsObject;
  static toObject(includeInstance: boolean, msg: JobRequest): JobRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobRequest;
  static deserializeBinaryFromReader(message: JobRequest, reader: jspb.BinaryReader): JobRequest;
}

export namespace JobRequest {
  export type AsObject = {
    yaml: string,
    jobId: string,
  }
}

export class StageRequest extends jspb.Message {
  getYaml(): string;
  setYaml(value: string): void;

  getStage(): string;
  setStage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StageRequest): StageRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StageRequest;
  static deserializeBinaryFromReader(message: StageRequest, reader: jspb.BinaryReader): StageRequest;
}

export namespace StageRequest {
  export type AsObject = {
    yaml: string,
    stage: string,
  }
}

export class KeyValue extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KeyValue.AsObject;
  static toObject(includeInstance: boolean, msg: KeyValue): KeyValue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KeyValue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KeyValue;
  static deserializeBinaryFromReader(message: KeyValue, reader: jspb.BinaryReader): KeyValue;
}

export namespace KeyValue {
  export type AsObject = {
    key: string,
    value: string,
  }
}

export class PipelineIssue extends jspb.Message {
  getPath(): string;
  setPath(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PipelineIssue.AsObject;
  static toObject(includeInstance: boolean, msg: PipelineIssue): PipelineIssue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PipelineIssue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PipelineIssue;
  static deserializeBinaryFromReader(message: PipelineIssue, reader: jspb.BinaryReader): PipelineIssue;
}

export namespace PipelineIssue {
  export type AsObject = {
    path: string,
    message: string,
  }
}

export class ImageRef extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearEntrypointList(): void;
  getEntrypointList(): Array<string>;
  setEntrypointList(value: Array<string>): void;
  addEntrypoint(value: string, index?: number): string;

  getPullPolicy(): string;
  setPullPolicy(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ImageRef.AsObject;
  static toObject(includeInstance: boolean, msg: ImageRef): ImageRef.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ImageRef, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ImageRef;
  static deserializeBinaryFromReader(message: ImageRef, reader: jspb.BinaryReader): ImageRef;
}

export namespace ImageRef {
  export type AsObject = {
    name: string,
    entrypointList: Array<string>,
    pullPolicy: string,
  }
}

export class ServiceRef extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearEntrypointList(): void;
  getEntrypointList(): Array<string>;
  setEntrypointList(value: Array<string>): void;
  addEntrypoint(value: string, index?: number): string;

  getPullPolicy(): string;
  setPullPolicy(value: string): void;

  getAlias(): string;
  setAlias(value: string): void;

  clearCommandList(): void;
  getCommandList(): Array<string>;
  setCommandList(value: Array<string>): void;
  addCommand(value: string, index?: number): string;

  clearVariablesList(): void;
  getVariablesList(): Array<KeyValue>;
  setVariablesList(value: Array<KeyValue>): void;
  addVariables(value?: KeyValue, index?: number): KeyValue;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceRef.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceRef): ServiceRef.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceRef, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceRef;
  static deserializeBinaryFromReader(message: ServiceRef, reader: jspb.BinaryReader): ServiceRef;
}

export namespace ServiceRef {
  export type AsObject = {
    name: string,
    entrypointList: Array<string>,
    pullPolicy: string,
    alias: string,
    commandList: Array<string>,
    variablesList: Array<KeyValue.AsObject>,
  }
}

export class CacheConfig extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  clearKeyFilesList(): void;
  getKeyFilesList(): Array<string>;
  setKeyFilesList(value: Array<string>): void;
  addKeyFiles(value: string, index?: number): string;

  getKeyPrefix(): string;
  setKeyPrefix(value: string): void;

  clearPathsList(): void;
  getPathsList(): Array<string>;
  setPathsList(value: Array<string>): void;
  addPaths(value: string, index?: number): string;

  getPolicy(): string;
  setPolicy(value: string): void;

  getWhen(): string;
  setWhen(value: string): void;

  getUnprotect(): boolean;
  setUnprotect(value: boolean): void;

  getUntracked(): boolean;
  setUntracked(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CacheConfig.AsObject;
  static toObject(includeInstance: boolean, msg: CacheConfig): CacheConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CacheConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CacheConfig;
  static deserializeBinaryFromReader(message: CacheConfig, reader: jspb.BinaryReader): CacheConfig;
}

export namespace CacheConfig {
  export type AsObject = {
    key: string,
    keyFilesList: Array<string>,
    keyPrefix: string,
    pathsList: Array<string>,
    policy: string,
    when: string,
    unprotect: boolean,
    untracked: boolean,
  }
}

export class ArtifactsConfig extends jspb.Message {
  clearPathsList(): void;
  getPathsList(): Array<string>;
  setPathsList(value: Array<string>): void;
  addPaths(value: string, index?: number): string;

  clearExcludeList(): void;
  getExcludeList(): Array<string>;
  setExcludeList(value: Array<string>): void;
  addExclude(value: string, index?: number): string;

  getExpireIn(): string;
  setExpireIn(value: string): void;

  getWhen(): string;
  setWhen(value: string): void;

  clearReportsList(): void;
  getReportsList(): Array<KeyValue>;
  setReportsList(value: Array<KeyValue>): void;
  addReports(value?: KeyValue, index?: number): KeyValue;

  getName(): string;
  setName(value: string): void;

  getPublicArtifacts(): boolean;
  setPublicArtifacts(value: boolean): void;

  getPublicSpecified(): boolean;
  setPublicSpecified(value: boolean): void;

  getExposeAs(): string;
  setExposeAs(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ArtifactsConfig.AsObject;
  static toObject(includeInstance: boolean, msg: ArtifactsConfig): ArtifactsConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ArtifactsConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ArtifactsConfig;
  static deserializeBinaryFromReader(message: ArtifactsConfig, reader: jspb.BinaryReader): ArtifactsConfig;
}

export namespace ArtifactsConfig {
  export type AsObject = {
    pathsList: Array<string>,
    excludeList: Array<string>,
    expireIn: string,
    when: string,
    reportsList: Array<KeyValue.AsObject>,
    name: string,
    publicArtifacts: boolean,
    publicSpecified: boolean,
    exposeAs: string,
  }
}

export class RuleCondition extends jspb.Message {
  getIfCondition(): string;
  setIfCondition(value: string): void;

  clearChangesList(): void;
  getChangesList(): Array<string>;
  setChangesList(value: Array<string>): void;
  addChanges(value: string, index?: number): string;

  clearExistsList(): void;
  getExistsList(): Array<string>;
  setExistsList(value: Array<string>): void;
  addExists(value: string, index?: number): string;

  getWhen(): string;
  setWhen(value: string): void;

  getAllowFailure(): boolean;
  setAllowFailure(value: boolean): void;

  getAllowFailureSpecified(): boolean;
  setAllowFailureSpecified(value: boolean): void;

  clearVariablesList(): void;
  getVariablesList(): Array<KeyValue>;
  setVariablesList(value: Array<KeyValue>): void;
  addVariables(value?: KeyValue, index?: number): KeyValue;

  getStartIn(): string;
  setStartIn(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RuleCondition.AsObject;
  static toObject(includeInstance: boolean, msg: RuleCondition): RuleCondition.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RuleCondition, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RuleCondition;
  static deserializeBinaryFromReader(message: RuleCondition, reader: jspb.BinaryReader): RuleCondition;
}

export namespace RuleCondition {
  export type AsObject = {
    ifCondition: string,
    changesList: Array<string>,
    existsList: Array<string>,
    when: string,
    allowFailure: boolean,
    allowFailureSpecified: boolean,
    variablesList: Array<KeyValue.AsObject>,
    startIn: string,
  }
}

export class OnlyExceptConfig extends jspb.Message {
  getSpecified(): boolean;
  setSpecified(value: boolean): void;

  clearRefsList(): void;
  getRefsList(): Array<string>;
  setRefsList(value: Array<string>): void;
  addRefs(value: string, index?: number): string;

  clearKindsList(): void;
  getKindsList(): Array<string>;
  setKindsList(value: Array<string>): void;
  addKinds(value: string, index?: number): string;

  clearVariablesList(): void;
  getVariablesList(): Array<string>;
  setVariablesList(value: Array<string>): void;
  addVariables(value: string, index?: number): string;

  clearChangesList(): void;
  getChangesList(): Array<string>;
  setChangesList(value: Array<string>): void;
  addChanges(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OnlyExceptConfig.AsObject;
  static toObject(includeInstance: boolean, msg: OnlyExceptConfig): OnlyExceptConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OnlyExceptConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OnlyExceptConfig;
  static deserializeBinaryFromReader(message: OnlyExceptConfig, reader: jspb.BinaryReader): OnlyExceptConfig;
}

export namespace OnlyExceptConfig {
  export type AsObject = {
    specified: boolean,
    refsList: Array<string>,
    kindsList: Array<string>,
    variablesList: Array<string>,
    changesList: Array<string>,
  }
}

export class NeedRef extends jspb.Message {
  getJob(): string;
  setJob(value: string): void;

  getIsSimple(): boolean;
  setIsSimple(value: boolean): void;

  getArtifacts(): boolean;
  setArtifacts(value: boolean): void;

  getArtifactsSpecified(): boolean;
  setArtifactsSpecified(value: boolean): void;

  getOptional(): boolean;
  setOptional(value: boolean): void;

  getOptionalSpecified(): boolean;
  setOptionalSpecified(value: boolean): void;

  getPipeline(): string;
  setPipeline(value: string): void;

  getProject(): string;
  setProject(value: string): void;

  getRef(): string;
  setRef(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NeedRef.AsObject;
  static toObject(includeInstance: boolean, msg: NeedRef): NeedRef.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NeedRef, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NeedRef;
  static deserializeBinaryFromReader(message: NeedRef, reader: jspb.BinaryReader): NeedRef;
}

export namespace NeedRef {
  export type AsObject = {
    job: string,
    isSimple: boolean,
    artifacts: boolean,
    artifactsSpecified: boolean,
    optional: boolean,
    optionalSpecified: boolean,
    pipeline: string,
    project: string,
    ref: string,
  }
}

export class AllowFailureConfig extends jspb.Message {
  getAllowed(): boolean;
  setAllowed(value: boolean): void;

  getSpecified(): boolean;
  setSpecified(value: boolean): void;

  clearExitCodesList(): void;
  getExitCodesList(): Array<number>;
  setExitCodesList(value: Array<number>): void;
  addExitCodes(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AllowFailureConfig.AsObject;
  static toObject(includeInstance: boolean, msg: AllowFailureConfig): AllowFailureConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AllowFailureConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AllowFailureConfig;
  static deserializeBinaryFromReader(message: AllowFailureConfig, reader: jspb.BinaryReader): AllowFailureConfig;
}

export namespace AllowFailureConfig {
  export type AsObject = {
    allowed: boolean,
    specified: boolean,
    exitCodesList: Array<number>,
  }
}

export class IncludeEntry extends jspb.Message {
  getKind(): string;
  setKind(value: string): void;

  getLocal(): string;
  setLocal(value: string): void;

  getProject(): string;
  setProject(value: string): void;

  getRef(): string;
  setRef(value: string): void;

  getFile(): string;
  setFile(value: string): void;

  getRemote(): string;
  setRemote(value: string): void;

  getTemplate(): string;
  setTemplate(value: string): void;

  getComponent(): string;
  setComponent(value: string): void;

  clearInputsList(): void;
  getInputsList(): Array<KeyValue>;
  setInputsList(value: Array<KeyValue>): void;
  addInputs(value?: KeyValue, index?: number): KeyValue;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IncludeEntry.AsObject;
  static toObject(includeInstance: boolean, msg: IncludeEntry): IncludeEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IncludeEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IncludeEntry;
  static deserializeBinaryFromReader(message: IncludeEntry, reader: jspb.BinaryReader): IncludeEntry;
}

export namespace IncludeEntry {
  export type AsObject = {
    kind: string,
    local: string,
    project: string,
    ref: string,
    file: string,
    remote: string,
    template: string,
    component: string,
    inputsList: Array<KeyValue.AsObject>,
  }
}

export class JobBrief extends jspb.Message {
  getJobId(): string;
  setJobId(value: string): void;

  getStage(): string;
  setStage(value: string): void;

  getHasScript(): boolean;
  setHasScript(value: boolean): void;

  getScriptLineCount(): number;
  setScriptLineCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobBrief.AsObject;
  static toObject(includeInstance: boolean, msg: JobBrief): JobBrief.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobBrief, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobBrief;
  static deserializeBinaryFromReader(message: JobBrief, reader: jspb.BinaryReader): JobBrief;
}

export namespace JobBrief {
  export type AsObject = {
    jobId: string,
    stage: string,
    hasScript: boolean,
    scriptLineCount: number,
  }
}

export class ParsePipelineResult extends jspb.Message {
  clearStagesList(): void;
  getStagesList(): Array<string>;
  setStagesList(value: Array<string>): void;
  addStages(value: string, index?: number): string;

  clearJobsList(): void;
  getJobsList(): Array<JobBrief>;
  setJobsList(value: Array<JobBrief>): void;
  addJobs(value?: JobBrief, index?: number): JobBrief;

  getHasVariables(): boolean;
  setHasVariables(value: boolean): void;

  getHasDefault(): boolean;
  setHasDefault(value: boolean): void;

  getHasWorkflow(): boolean;
  setHasWorkflow(value: boolean): void;

  getHasInclude(): boolean;
  setHasInclude(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParsePipelineResult.AsObject;
  static toObject(includeInstance: boolean, msg: ParsePipelineResult): ParsePipelineResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParsePipelineResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParsePipelineResult;
  static deserializeBinaryFromReader(message: ParsePipelineResult, reader: jspb.BinaryReader): ParsePipelineResult;
}

export namespace ParsePipelineResult {
  export type AsObject = {
    stagesList: Array<string>,
    jobsList: Array<JobBrief.AsObject>,
    hasVariables: boolean,
    hasDefault: boolean,
    hasWorkflow: boolean,
    hasInclude: boolean,
    error: string,
  }
}

export class JobSummary extends jspb.Message {
  getJobId(): string;
  setJobId(value: string): void;

  getStage(): string;
  setStage(value: string): void;

  clearScriptList(): void;
  getScriptList(): Array<string>;
  setScriptList(value: Array<string>): void;
  addScript(value: string, index?: number): string;

  clearNeedsList(): void;
  getNeedsList(): Array<NeedRef>;
  setNeedsList(value: Array<NeedRef>): void;
  addNeeds(value?: NeedRef, index?: number): NeedRef;

  clearRulesList(): void;
  getRulesList(): Array<RuleCondition>;
  setRulesList(value: Array<RuleCondition>): void;
  addRules(value?: RuleCondition, index?: number): RuleCondition;

  getWhen(): string;
  setWhen(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobSummary.AsObject;
  static toObject(includeInstance: boolean, msg: JobSummary): JobSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobSummary;
  static deserializeBinaryFromReader(message: JobSummary, reader: jspb.BinaryReader): JobSummary;
}

export namespace JobSummary {
  export type AsObject = {
    jobId: string,
    stage: string,
    scriptList: Array<string>,
    needsList: Array<NeedRef.AsObject>,
    rulesList: Array<RuleCondition.AsObject>,
    when: string,
  }
}

export class ListJobsResult extends jspb.Message {
  clearJobsList(): void;
  getJobsList(): Array<JobSummary>;
  setJobsList(value: Array<JobSummary>): void;
  addJobs(value?: JobSummary, index?: number): JobSummary;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListJobsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListJobsResult): ListJobsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListJobsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListJobsResult;
  static deserializeBinaryFromReader(message: ListJobsResult, reader: jspb.BinaryReader): ListJobsResult;
}

export namespace ListJobsResult {
  export type AsObject = {
    jobsList: Array<JobSummary.AsObject>,
    error: string,
  }
}

export class ListStagesResult extends jspb.Message {
  clearStagesList(): void;
  getStagesList(): Array<string>;
  setStagesList(value: Array<string>): void;
  addStages(value: string, index?: number): string;

  getIsDefault(): boolean;
  setIsDefault(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListStagesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListStagesResult): ListStagesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListStagesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListStagesResult;
  static deserializeBinaryFromReader(message: ListStagesResult, reader: jspb.BinaryReader): ListStagesResult;
}

export namespace ListStagesResult {
  export type AsObject = {
    stagesList: Array<string>,
    isDefault: boolean,
    error: string,
  }
}

export class GetJobConfigResult extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  getJobId(): string;
  setJobId(value: string): void;

  getStage(): string;
  setStage(value: string): void;

  clearScriptList(): void;
  getScriptList(): Array<string>;
  setScriptList(value: Array<string>): void;
  addScript(value: string, index?: number): string;

  clearBeforeScriptList(): void;
  getBeforeScriptList(): Array<string>;
  setBeforeScriptList(value: Array<string>): void;
  addBeforeScript(value: string, index?: number): string;

  clearAfterScriptList(): void;
  getAfterScriptList(): Array<string>;
  setAfterScriptList(value: Array<string>): void;
  addAfterScript(value: string, index?: number): string;

  hasImage(): boolean;
  clearImage(): void;
  getImage(): ImageRef | undefined;
  setImage(value?: ImageRef): void;

  getHasImage(): boolean;
  setHasImage(value: boolean): void;

  clearServicesList(): void;
  getServicesList(): Array<ServiceRef>;
  setServicesList(value: Array<ServiceRef>): void;
  addServices(value?: ServiceRef, index?: number): ServiceRef;

  clearVariablesList(): void;
  getVariablesList(): Array<KeyValue>;
  setVariablesList(value: Array<KeyValue>): void;
  addVariables(value?: KeyValue, index?: number): KeyValue;

  hasArtifacts(): boolean;
  clearArtifacts(): void;
  getArtifacts(): ArtifactsConfig | undefined;
  setArtifacts(value?: ArtifactsConfig): void;

  getHasArtifacts(): boolean;
  setHasArtifacts(value: boolean): void;

  clearCacheList(): void;
  getCacheList(): Array<CacheConfig>;
  setCacheList(value: Array<CacheConfig>): void;
  addCache(value?: CacheConfig, index?: number): CacheConfig;

  clearRulesList(): void;
  getRulesList(): Array<RuleCondition>;
  setRulesList(value: Array<RuleCondition>): void;
  addRules(value?: RuleCondition, index?: number): RuleCondition;

  hasOnly(): boolean;
  clearOnly(): void;
  getOnly(): OnlyExceptConfig | undefined;
  setOnly(value?: OnlyExceptConfig): void;

  hasExcept(): boolean;
  clearExcept(): void;
  getExcept(): OnlyExceptConfig | undefined;
  setExcept(value?: OnlyExceptConfig): void;

  clearNeedsList(): void;
  getNeedsList(): Array<NeedRef>;
  setNeedsList(value: Array<NeedRef>): void;
  addNeeds(value?: NeedRef, index?: number): NeedRef;

  clearExtendsList(): void;
  getExtendsList(): Array<string>;
  setExtendsList(value: Array<string>): void;
  addExtends(value: string, index?: number): string;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  getWhen(): string;
  setWhen(value: string): void;

  hasAllowFailure(): boolean;
  clearAllowFailure(): void;
  getAllowFailure(): AllowFailureConfig | undefined;
  setAllowFailure(value?: AllowFailureConfig): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetJobConfigResult.AsObject;
  static toObject(includeInstance: boolean, msg: GetJobConfigResult): GetJobConfigResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetJobConfigResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetJobConfigResult;
  static deserializeBinaryFromReader(message: GetJobConfigResult, reader: jspb.BinaryReader): GetJobConfigResult;
}

export namespace GetJobConfigResult {
  export type AsObject = {
    found: boolean,
    jobId: string,
    stage: string,
    scriptList: Array<string>,
    beforeScriptList: Array<string>,
    afterScriptList: Array<string>,
    image?: ImageRef.AsObject,
    hasImage: boolean,
    servicesList: Array<ServiceRef.AsObject>,
    variablesList: Array<KeyValue.AsObject>,
    artifacts?: ArtifactsConfig.AsObject,
    hasArtifacts: boolean,
    cacheList: Array<CacheConfig.AsObject>,
    rulesList: Array<RuleCondition.AsObject>,
    only?: OnlyExceptConfig.AsObject,
    except?: OnlyExceptConfig.AsObject,
    needsList: Array<NeedRef.AsObject>,
    extendsList: Array<string>,
    tagsList: Array<string>,
    when: string,
    allowFailure?: AllowFailureConfig.AsObject,
    error: string,
  }
}

export class JobDependencyEdge extends jspb.Message {
  getJobId(): string;
  setJobId(value: string): void;

  getDependsOn(): string;
  setDependsOn(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobDependencyEdge.AsObject;
  static toObject(includeInstance: boolean, msg: JobDependencyEdge): JobDependencyEdge.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobDependencyEdge, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobDependencyEdge;
  static deserializeBinaryFromReader(message: JobDependencyEdge, reader: jspb.BinaryReader): JobDependencyEdge;
}

export namespace JobDependencyEdge {
  export type AsObject = {
    jobId: string,
    dependsOn: string,
  }
}

export class ExtractJobDependenciesResult extends jspb.Message {
  clearJobIdsList(): void;
  getJobIdsList(): Array<string>;
  setJobIdsList(value: Array<string>): void;
  addJobIds(value: string, index?: number): string;

  clearEdgesList(): void;
  getEdgesList(): Array<JobDependencyEdge>;
  setEdgesList(value: Array<JobDependencyEdge>): void;
  addEdges(value?: JobDependencyEdge, index?: number): JobDependencyEdge;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractJobDependenciesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractJobDependenciesResult): ExtractJobDependenciesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractJobDependenciesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractJobDependenciesResult;
  static deserializeBinaryFromReader(message: ExtractJobDependenciesResult, reader: jspb.BinaryReader): ExtractJobDependenciesResult;
}

export namespace ExtractJobDependenciesResult {
  export type AsObject = {
    jobIdsList: Array<string>,
    edgesList: Array<JobDependencyEdge.AsObject>,
    error: string,
  }
}

export class StageJobs extends jspb.Message {
  getStage(): string;
  setStage(value: string): void;

  clearJobIdsList(): void;
  getJobIdsList(): Array<string>;
  setJobIdsList(value: Array<string>): void;
  addJobIds(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StageJobs.AsObject;
  static toObject(includeInstance: boolean, msg: StageJobs): StageJobs.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StageJobs, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StageJobs;
  static deserializeBinaryFromReader(message: StageJobs, reader: jspb.BinaryReader): StageJobs;
}

export namespace StageJobs {
  export type AsObject = {
    stage: string,
    jobIdsList: Array<string>,
  }
}

export class ExtractStageDAGResult extends jspb.Message {
  clearStagesList(): void;
  getStagesList(): Array<string>;
  setStagesList(value: Array<string>): void;
  addStages(value: string, index?: number): string;

  clearStageJobsList(): void;
  getStageJobsList(): Array<StageJobs>;
  setStageJobsList(value: Array<StageJobs>): void;
  addStageJobs(value?: StageJobs, index?: number): StageJobs;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractStageDAGResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractStageDAGResult): ExtractStageDAGResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractStageDAGResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractStageDAGResult;
  static deserializeBinaryFromReader(message: ExtractStageDAGResult, reader: jspb.BinaryReader): ExtractStageDAGResult;
}

export namespace ExtractStageDAGResult {
  export type AsObject = {
    stagesList: Array<string>,
    stageJobsList: Array<StageJobs.AsObject>,
    error: string,
  }
}

export class ExtractRulesResult extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  clearRulesList(): void;
  getRulesList(): Array<RuleCondition>;
  setRulesList(value: Array<RuleCondition>): void;
  addRules(value?: RuleCondition, index?: number): RuleCondition;

  hasOnly(): boolean;
  clearOnly(): void;
  getOnly(): OnlyExceptConfig | undefined;
  setOnly(value?: OnlyExceptConfig): void;

  hasExcept(): boolean;
  clearExcept(): void;
  getExcept(): OnlyExceptConfig | undefined;
  setExcept(value?: OnlyExceptConfig): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractRulesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractRulesResult): ExtractRulesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractRulesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractRulesResult;
  static deserializeBinaryFromReader(message: ExtractRulesResult, reader: jspb.BinaryReader): ExtractRulesResult;
}

export namespace ExtractRulesResult {
  export type AsObject = {
    found: boolean,
    rulesList: Array<RuleCondition.AsObject>,
    only?: OnlyExceptConfig.AsObject,
    except?: OnlyExceptConfig.AsObject,
    error: string,
  }
}

export class ExtractIncludesResult extends jspb.Message {
  clearIncludesList(): void;
  getIncludesList(): Array<IncludeEntry>;
  setIncludesList(value: Array<IncludeEntry>): void;
  addIncludes(value?: IncludeEntry, index?: number): IncludeEntry;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractIncludesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractIncludesResult): ExtractIncludesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractIncludesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractIncludesResult;
  static deserializeBinaryFromReader(message: ExtractIncludesResult, reader: jspb.BinaryReader): ExtractIncludesResult;
}

export namespace ExtractIncludesResult {
  export type AsObject = {
    includesList: Array<IncludeEntry.AsObject>,
    error: string,
  }
}

export class JobVariables extends jspb.Message {
  getJobId(): string;
  setJobId(value: string): void;

  clearVariablesList(): void;
  getVariablesList(): Array<KeyValue>;
  setVariablesList(value: Array<KeyValue>): void;
  addVariables(value?: KeyValue, index?: number): KeyValue;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobVariables.AsObject;
  static toObject(includeInstance: boolean, msg: JobVariables): JobVariables.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobVariables, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobVariables;
  static deserializeBinaryFromReader(message: JobVariables, reader: jspb.BinaryReader): JobVariables;
}

export namespace JobVariables {
  export type AsObject = {
    jobId: string,
    variablesList: Array<KeyValue.AsObject>,
  }
}

export class ExtractVariablesResult extends jspb.Message {
  clearGlobalVariablesList(): void;
  getGlobalVariablesList(): Array<KeyValue>;
  setGlobalVariablesList(value: Array<KeyValue>): void;
  addGlobalVariables(value?: KeyValue, index?: number): KeyValue;

  clearJobVariablesList(): void;
  getJobVariablesList(): Array<JobVariables>;
  setJobVariablesList(value: Array<JobVariables>): void;
  addJobVariables(value?: JobVariables, index?: number): JobVariables;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractVariablesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractVariablesResult): ExtractVariablesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractVariablesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractVariablesResult;
  static deserializeBinaryFromReader(message: ExtractVariablesResult, reader: jspb.BinaryReader): ExtractVariablesResult;
}

export namespace ExtractVariablesResult {
  export type AsObject = {
    globalVariablesList: Array<KeyValue.AsObject>,
    jobVariablesList: Array<JobVariables.AsObject>,
    error: string,
  }
}

export class JobImages extends jspb.Message {
  getJobId(): string;
  setJobId(value: string): void;

  hasImage(): boolean;
  clearImage(): void;
  getImage(): ImageRef | undefined;
  setImage(value?: ImageRef): void;

  getHasImage(): boolean;
  setHasImage(value: boolean): void;

  clearServicesList(): void;
  getServicesList(): Array<ServiceRef>;
  setServicesList(value: Array<ServiceRef>): void;
  addServices(value?: ServiceRef, index?: number): ServiceRef;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobImages.AsObject;
  static toObject(includeInstance: boolean, msg: JobImages): JobImages.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobImages, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobImages;
  static deserializeBinaryFromReader(message: JobImages, reader: jspb.BinaryReader): JobImages;
}

export namespace JobImages {
  export type AsObject = {
    jobId: string,
    image?: ImageRef.AsObject,
    hasImage: boolean,
    servicesList: Array<ServiceRef.AsObject>,
  }
}

export class ExtractImagesResult extends jspb.Message {
  hasGlobalImage(): boolean;
  clearGlobalImage(): void;
  getGlobalImage(): ImageRef | undefined;
  setGlobalImage(value?: ImageRef): void;

  getHasGlobalImage(): boolean;
  setHasGlobalImage(value: boolean): void;

  clearGlobalServicesList(): void;
  getGlobalServicesList(): Array<ServiceRef>;
  setGlobalServicesList(value: Array<ServiceRef>): void;
  addGlobalServices(value?: ServiceRef, index?: number): ServiceRef;

  clearJobImagesList(): void;
  getJobImagesList(): Array<JobImages>;
  setJobImagesList(value: Array<JobImages>): void;
  addJobImages(value?: JobImages, index?: number): JobImages;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractImagesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractImagesResult): ExtractImagesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractImagesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractImagesResult;
  static deserializeBinaryFromReader(message: ExtractImagesResult, reader: jspb.BinaryReader): ExtractImagesResult;
}

export namespace ExtractImagesResult {
  export type AsObject = {
    globalImage?: ImageRef.AsObject,
    hasGlobalImage: boolean,
    globalServicesList: Array<ServiceRef.AsObject>,
    jobImagesList: Array<JobImages.AsObject>,
    error: string,
  }
}

export class JobArtifacts extends jspb.Message {
  getJobId(): string;
  setJobId(value: string): void;

  hasArtifacts(): boolean;
  clearArtifacts(): void;
  getArtifacts(): ArtifactsConfig | undefined;
  setArtifacts(value?: ArtifactsConfig): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobArtifacts.AsObject;
  static toObject(includeInstance: boolean, msg: JobArtifacts): JobArtifacts.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobArtifacts, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobArtifacts;
  static deserializeBinaryFromReader(message: JobArtifacts, reader: jspb.BinaryReader): JobArtifacts;
}

export namespace JobArtifacts {
  export type AsObject = {
    jobId: string,
    artifacts?: ArtifactsConfig.AsObject,
  }
}

export class ExtractArtifactsResult extends jspb.Message {
  clearArtifactsList(): void;
  getArtifactsList(): Array<JobArtifacts>;
  setArtifactsList(value: Array<JobArtifacts>): void;
  addArtifacts(value?: JobArtifacts, index?: number): JobArtifacts;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractArtifactsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractArtifactsResult): ExtractArtifactsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractArtifactsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractArtifactsResult;
  static deserializeBinaryFromReader(message: ExtractArtifactsResult, reader: jspb.BinaryReader): ExtractArtifactsResult;
}

export namespace ExtractArtifactsResult {
  export type AsObject = {
    artifactsList: Array<JobArtifacts.AsObject>,
    error: string,
  }
}

export class JobCache extends jspb.Message {
  getJobId(): string;
  setJobId(value: string): void;

  clearCacheList(): void;
  getCacheList(): Array<CacheConfig>;
  setCacheList(value: Array<CacheConfig>): void;
  addCache(value?: CacheConfig, index?: number): CacheConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobCache.AsObject;
  static toObject(includeInstance: boolean, msg: JobCache): JobCache.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobCache, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobCache;
  static deserializeBinaryFromReader(message: JobCache, reader: jspb.BinaryReader): JobCache;
}

export namespace JobCache {
  export type AsObject = {
    jobId: string,
    cacheList: Array<CacheConfig.AsObject>,
  }
}

export class ExtractCacheResult extends jspb.Message {
  clearCachesList(): void;
  getCachesList(): Array<JobCache>;
  setCachesList(value: Array<JobCache>): void;
  addCaches(value?: JobCache, index?: number): JobCache;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractCacheResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractCacheResult): ExtractCacheResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractCacheResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractCacheResult;
  static deserializeBinaryFromReader(message: ExtractCacheResult, reader: jspb.BinaryReader): ExtractCacheResult;
}

export namespace ExtractCacheResult {
  export type AsObject = {
    cachesList: Array<JobCache.AsObject>,
    error: string,
  }
}

export class ResolveExtendsResult extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  clearExtendsChainList(): void;
  getExtendsChainList(): Array<string>;
  setExtendsChainList(value: Array<string>): void;
  addExtendsChain(value: string, index?: number): string;

  getMergedStage(): string;
  setMergedStage(value: string): void;

  clearMergedScriptList(): void;
  getMergedScriptList(): Array<string>;
  setMergedScriptList(value: Array<string>): void;
  addMergedScript(value: string, index?: number): string;

  clearMergedBeforeScriptList(): void;
  getMergedBeforeScriptList(): Array<string>;
  setMergedBeforeScriptList(value: Array<string>): void;
  addMergedBeforeScript(value: string, index?: number): string;

  clearMergedAfterScriptList(): void;
  getMergedAfterScriptList(): Array<string>;
  setMergedAfterScriptList(value: Array<string>): void;
  addMergedAfterScript(value: string, index?: number): string;

  clearMergedVariablesList(): void;
  getMergedVariablesList(): Array<KeyValue>;
  setMergedVariablesList(value: Array<KeyValue>): void;
  addMergedVariables(value?: KeyValue, index?: number): KeyValue;

  clearMergedTagsList(): void;
  getMergedTagsList(): Array<string>;
  setMergedTagsList(value: Array<string>): void;
  addMergedTags(value: string, index?: number): string;

  hasMergedImage(): boolean;
  clearMergedImage(): void;
  getMergedImage(): ImageRef | undefined;
  setMergedImage(value?: ImageRef): void;

  getHasImage(): boolean;
  setHasImage(value: boolean): void;

  clearMergedRulesList(): void;
  getMergedRulesList(): Array<RuleCondition>;
  setMergedRulesList(value: Array<RuleCondition>): void;
  addMergedRules(value?: RuleCondition, index?: number): RuleCondition;

  clearMergedCacheList(): void;
  getMergedCacheList(): Array<CacheConfig>;
  setMergedCacheList(value: Array<CacheConfig>): void;
  addMergedCache(value?: CacheConfig, index?: number): CacheConfig;

  hasMergedArtifacts(): boolean;
  clearMergedArtifacts(): void;
  getMergedArtifacts(): ArtifactsConfig | undefined;
  setMergedArtifacts(value?: ArtifactsConfig): void;

  getHasArtifacts(): boolean;
  setHasArtifacts(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResolveExtendsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ResolveExtendsResult): ResolveExtendsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResolveExtendsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResolveExtendsResult;
  static deserializeBinaryFromReader(message: ResolveExtendsResult, reader: jspb.BinaryReader): ResolveExtendsResult;
}

export namespace ResolveExtendsResult {
  export type AsObject = {
    found: boolean,
    extendsChainList: Array<string>,
    mergedStage: string,
    mergedScriptList: Array<string>,
    mergedBeforeScriptList: Array<string>,
    mergedAfterScriptList: Array<string>,
    mergedVariablesList: Array<KeyValue.AsObject>,
    mergedTagsList: Array<string>,
    mergedImage?: ImageRef.AsObject,
    hasImage: boolean,
    mergedRulesList: Array<RuleCondition.AsObject>,
    mergedCacheList: Array<CacheConfig.AsObject>,
    mergedArtifacts?: ArtifactsConfig.AsObject,
    hasArtifacts: boolean,
    error: string,
  }
}

export class GetJobsByStageResult extends jspb.Message {
  clearJobIdsList(): void;
  getJobIdsList(): Array<string>;
  setJobIdsList(value: Array<string>): void;
  addJobIds(value: string, index?: number): string;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetJobsByStageResult.AsObject;
  static toObject(includeInstance: boolean, msg: GetJobsByStageResult): GetJobsByStageResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetJobsByStageResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetJobsByStageResult;
  static deserializeBinaryFromReader(message: GetJobsByStageResult, reader: jspb.BinaryReader): GetJobsByStageResult;
}

export namespace GetJobsByStageResult {
  export type AsObject = {
    jobIdsList: Array<string>,
    error: string,
  }
}

export class DetectHiddenJobsResult extends jspb.Message {
  clearHiddenJobIdsList(): void;
  getHiddenJobIdsList(): Array<string>;
  setHiddenJobIdsList(value: Array<string>): void;
  addHiddenJobIds(value: string, index?: number): string;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetectHiddenJobsResult.AsObject;
  static toObject(includeInstance: boolean, msg: DetectHiddenJobsResult): DetectHiddenJobsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetectHiddenJobsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetectHiddenJobsResult;
  static deserializeBinaryFromReader(message: DetectHiddenJobsResult, reader: jspb.BinaryReader): DetectHiddenJobsResult;
}

export namespace DetectHiddenJobsResult {
  export type AsObject = {
    hiddenJobIdsList: Array<string>,
    error: string,
  }
}

export class SummarizePipelineResult extends jspb.Message {
  getJobCount(): number;
  setJobCount(value: number): void;

  getHiddenJobCount(): number;
  setHiddenJobCount(value: number): void;

  getStageCount(): number;
  setStageCount(value: number): void;

  getIncludeCount(): number;
  setIncludeCount(value: number): void;

  getVariableCount(): number;
  setVariableCount(value: number): void;

  getHasWorkflow(): boolean;
  setHasWorkflow(value: boolean): void;

  getHasDefault(): boolean;
  setHasDefault(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SummarizePipelineResult.AsObject;
  static toObject(includeInstance: boolean, msg: SummarizePipelineResult): SummarizePipelineResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SummarizePipelineResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SummarizePipelineResult;
  static deserializeBinaryFromReader(message: SummarizePipelineResult, reader: jspb.BinaryReader): SummarizePipelineResult;
}

export namespace SummarizePipelineResult {
  export type AsObject = {
    jobCount: number,
    hiddenJobCount: number,
    stageCount: number,
    includeCount: number,
    variableCount: number,
    hasWorkflow: boolean,
    hasDefault: boolean,
    error: string,
  }
}

export class ValidatePipelineResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearIssuesList(): void;
  getIssuesList(): Array<PipelineIssue>;
  setIssuesList(value: Array<PipelineIssue>): void;
  addIssues(value?: PipelineIssue, index?: number): PipelineIssue;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidatePipelineResult.AsObject;
  static toObject(includeInstance: boolean, msg: ValidatePipelineResult): ValidatePipelineResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidatePipelineResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidatePipelineResult;
  static deserializeBinaryFromReader(message: ValidatePipelineResult, reader: jspb.BinaryReader): ValidatePipelineResult;
}

export namespace ValidatePipelineResult {
  export type AsObject = {
    valid: boolean,
    issuesList: Array<PipelineIssue.AsObject>,
    error: string,
  }
}

